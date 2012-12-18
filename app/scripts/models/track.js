define(["jquery", "underscore","backbone","soundcloud","backbone.localStorage"], 
    function($,_,Backbone,SC){

    var Track = Backbone.Model.extend({
        
        defaults : {
            state : 'idle' // supported states : idle, playing, paused
        },

        isIdle : function(){
            return this.get('state') === 'idle';
        },

        isPlaying : function(){
            return this.get('state') === 'playing';
        },

        isPaused : function(){
            return this.get('state') === 'paused';
        },

        togglePlayback : function(){

            //see if there's another sound playing
            var currentlyPlaying;

            if(typeof this.collection !== 'undefined'){
                currentlyPlaying = _.find(this.collection.models, function(m){
                    return m.isPlaying();
                });
            }

            if(this.isIdle()){ 
                //untouched sound
                if(typeof currentlyPlaying !== 'undefined'){
                    currentlyPlaying.stop();
                }
            
                $.when(this.getSound()).done(_.bind(this.onSoundLoaded,this));
            }else{
                if(typeof currentlyPlaying !== 'undefined'){
                    if(currentlyPlaying.get("id") !== this.get('id')){
                        currentlyPlaying.stop();
                    }
                }

                //messing with the sound (play/pause)
                if(typeof this.sound !== 'undefined'){
                    this.sound.togglePause();
                    this.set({ 
                        state : this.isPlaying() ? 'paused' : 'playing' 
                    });
                    return;
                } 
            }
        },

        getSound : function(){
            var dfd = new $.Deferred();
            SC.stream("/tracks/" + this.get("scId"), function(sound){
                dfd.resolve(sound);
            });
            return dfd.promise();
        },

        onSoundLoaded : function(sound){
            this.sound = sound;
            this.sound.play({onfinish:_.bind(this.onSoundFinished,this)});
            this.set({ state : 'playing' });
        },

        onSoundFinished : function(){
            this.stop();

            if(typeof this.collection !== 'undefined'){
                if(typeof this.collection.getNextTrack !== 'undefined'){
                    $.when(this.collection.getNextTrack(this)).done(function(nextTrack){
                        if(nextTrack){
                            nextTrack.togglePlayback();
                        }
                    });
                }
            }

        },

        stop : function(){
            
            if(typeof this.sound !== 'undefined'){
                this.sound.stop();
                delete this.sound;
            }

            this.set({ 'state': 'idle' });
        
        },

        destroy : function(options){
            if(this.isPlaying()){
                this.stop();
            }

            return Backbone.Model.prototype.destroy.call(this,options);
        }
    });  


    var TrackCollection = Backbone.Collection.extend({
        model : Track,
        localStorage: new Backbone.LocalStorage("stacks::tracks"),
    
        addTrack : function(id, title, username, artworkUrl, playlistId, playlistOrder){
            return this.create({ 
                scId : id, 
                title: title, 
                username : username, 
                artworkUrl : artworkUrl, 
                playlistId : playlistId, 
                playlistOrder : playlistOrder
            }, {wait : true});    
        },

        getTracks : function(){
            var dfd = $.Deferred();
            if(this.models.length === 0){
                $.when(this.fetch()).done(_.bind(function(){
                    dfd.resolve(this.models);
                },this));
            } else {
                dfd.resolve(this.models);
            }   
            return dfd.promise();     
        },

        getTracksForPlaylist : function(playlistId){
            var dfd = $.Deferred();

            $.when(this.getTracks()).done(_.bind(function(){
                dfd.resolve(_.filter(this.models, function(m){
                    return m.get("playlistId") === playlistId;
                }));
            },this));

            return dfd.promise();
        },

        getNextTrack : function(track){

            var order = typeof track !== 'undefined' ? track.get("playlistOrder") : 0;
            var dfd = $.Deferred(); 

            $.when(this.getTracksForPlaylist(track.get("playlistId"))).done(
                function(tracks){
                    var nextTracks = _.sortBy(
                        _.filter(tracks,function(m){ 
                            return m.get("playlistOrder") > order; 
                        }), 
                        function(t){ 
                            return t.get("playlistOrder"); 
                        }
                    );

                    if(nextTracks.length !== 0){
                        dfd.resolve(nextTracks[0]);
                    }else{
                        dfd.resolve(null);
                    }
                }
            );

            return dfd.promise();
        }
    });

    var __tracks = new TrackCollection();

    return {
        Collection : TrackCollection,
    
        get : function(){
            return __tracks;
        },

        addTrack : function(id, title, username, artworkUrl, playlistId, playlistOrder){
            return __tracks.addTrack(id, 
                title, username, artworkUrl, playlistId, playlistOrder);
        },
        
        deleteTrack : function(track){
            track.destroy();
        }
    };

});

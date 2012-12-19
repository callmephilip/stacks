define(["jquery", "underscore","backbone","soundcloud","backbone.localStorage"], 
    function($,_,Backbone,SC){

    /*
        Track model
            - stores track data
                - SC id  
                - title
                - username of the author 
                - artworkUrl, 
                - id of the playlist
                - position within the playlist
            - knows how to play/pause the music
            - can automatically figure out what the next song is
    */

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


        /*
            Toggles playback on the track
                - if the track is already playing, pause it
                - if the track is paused, resume
                - otherwise load sound data and play it

            This method makes sure there's only one track playing at any time
            (TODO: this can actually be moved to the TrackCollection which can monitor state
            changes for tracks and adjust playback accordingly) 
        */
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

        /*
            Load sound data for streaming
        */
        getSound : function(){
            var dfd = new $.Deferred();
            SC.stream("/tracks/" + this.get("scId"), function(sound){
                dfd.resolve(sound);
            });
            return dfd.promise();
        },

        /*
            Once sound data is loaded, start playing music + update tracks internal status
        */
        onSoundLoaded : function(sound){
            this.sound = sound;
            this.sound.play({onfinish:_.bind(this.onSoundFinished,this)});
            this.set({ state : 'playing' });
        },

        /*
            When the song ends, attempt to locate the next song based on the playlist 
            and schedule its playback 
        */
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

        /*
            The laughing time is over
        */
        stop : function(){
            
            if(typeof this.sound !== 'undefined'){
                this.sound.stop();
                delete this.sound;
            }

            this.set({ 'state': 'idle' });
        
        },

        /*
            Make sure the playback is stopped before deleting the track
        */
        destroy : function(options){
            if(this.isPlaying()){
                this.stop();
            }

            return Backbone.Model.prototype.destroy.call(this,options);
        }
    });  

    /*
        TrackCollection keeps tracks all cosy together
            - creates new tracks
            - groups tracks by playlist
            - finds next track in the playlist
    */

    var TrackCollection = Backbone.Collection.extend({
        model : Track,
        localStorage: new Backbone.LocalStorage("stacks::tracks"),
    
        /*
            Create new track
                - playlist related data is provided by the playlist model
        */
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

        /*
            Convenience method around fetch
                - fetch tracks once
                - on subsequent requests return internal models list
        */
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

        /*
            Only get tracks within the given playlist
                - the playlist is identified by its id 
        */
        getTracksForPlaylist : function(playlistId){
            var dfd = $.Deferred();

            $.when(this.getTracks()).done(_.bind(function(){
                dfd.resolve(_.filter(this.models, function(m){
                    return m.get("playlistId") === playlistId;
                }));
            },this));

            return dfd.promise();
        },

        /*
            Get track that follows, undefined if none 
        */
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

    // keep only one instance of the track repository
    var __tracks = new TrackCollection();

    return {
        Collection : TrackCollection,
    
        /*
            Get access to the track repository
        */
        get : function(){
            return __tracks;
        },

        /*
            shortcut for get().addTrack
        */
        addTrack : function(id, title, username, artworkUrl, playlistId, playlistOrder){
            return __tracks.addTrack(id, 
                title, username, artworkUrl, playlistId, playlistOrder);
        },
        
        deleteTrack : function(track){
            track.destroy();
        }
    };

});

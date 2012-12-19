/*
    
    Tracklist View is rendered within a stack. 
    It contains Track views 
*/

define(["jquery","backbone","handlebars", 
    "models/track", "views/controls/track","text!templates/controls/track.list.html"],
    function($,Backbone,Handlebars,Tracks,TrackView,trackListTemplate){

    var TrackListView = Backbone.View.extend({

        template : Handlebars.compile(trackListTemplate),
        tagName : "ul",
        className : "tracks",

        initialize : function(attributes){
            attributes = attributes || {};

            if(typeof attributes.playlistId === 'undefined'){
                throw new Error("playlistId required");
            }
            this.playlistId = attributes.playlistId;
            
            //keep an eye on the central track repository
            Tracks.get().on("add", this.onTrackAdded, this);
            Tracks.get().on("remove", this.onTrackRemoved, this);
            Tracks.get().on("change", this.onTrackChanged, this);

            this.updateTracks(true);
        },

        /*
            TODO: move this into a separate model module

            TracklistView maintains a local list of track models
            which must be updated when things change in the central repository

            if rerender is true, the view will render itself
        */
        updateTracks : function(rerender){
            $.when(Tracks.get().getTracksForPlaylist(this.playlistId)).done(_.bind(function(tracks){
                this.tracks = tracks;
                if(rerender){
                    this.render();
                }
            }, this));  
        },

        /*
            This method is invoked from the outside (stack view) to ask for play all/pause 
        */
        onPlayAllToggle : function(){
            var currentTrack = this.getCurrentTrack();
            if(typeof currentTrack === 'undefined'){
                if(this.tracks.length !== 0){
                    this.tracks[0].togglePlayback();
                }
            } else {
                currentTrack.togglePlayback();
            }
        },

        stopAllMusic : function(){
            _.each(this.tracks, function(track){
                track.stop();
            });
        },

        gotTunes : function(){
            return this.tracks.length !== 0;
        },

        getCurrentTrack : function(){
            return _.find(this.tracks, function(t){
                return t.isPlaying();
            });
        },

        /*
            when new track is added, we need to display it
        */
        onTrackAdded : function(m){
            if(m.get("playlistId") === this.playlistId){
                $(this.el).append(new TrackView({ model : m }).render());
                this.updateTracks(false);
            }
        },

        /*
            update internal track storage    
        */
        onTrackRemoved : function(){
            this.updateTracks(false);
        },

        /*
            when track's state changes, propagate this to parent views 
        */
        onTrackChanged : function(m){
            if(m.get("playlistId") === this.playlistId){
                if(m.hasChanged("state")){
                    this.trigger("playbackStateChanged", m.get('state'));
                } 
            }
        },

        render : function(){
            $(this.el).html(this.template());

            if(typeof this.tracks !== 'undefined'){
                _.each(this.tracks, function(m){
                    $(this.el).append(
                        new TrackView({ model : m }).render() 
                    );
                }, this);
            }

            return this.el;
        }

    });  


    return TrackListView;
});
define(["jquery", "underscore","backbone", "models/track", "backbone.localStorage"], 

    function($,_,Backbone,Tracks){

    /*
        Playlist represents a playlist entity with the following data fields:
            - title
            - description
        Playlist takes care of track ordering.
        The bulk of the track related manipulations are delgated to TrackCollection
    */
    var Playlist = Backbone.Model.extend({

        /*
            Create a new track based on SC data. Tracks position in the list is determined based on the
            state of the Track collection for the list 

            addTrack creates a new Track object and returns it
        */
        addTrack : function(scId, title, username, artworkUrl){
            var dfd = $.Deferred();

            $.when(Tracks.get().getTracksForPlaylist(this.get("id"))).done(_.bind(function(tracks){

                // TODO: refactor this into a separate method
                // consider implementing a comparator function for the collection
                var currentOrder = tracks.length === 0 ? 0 :
                    _.max(_.map(tracks, function(t){
                        return parseInt(t.get("playlistOrder"),10);
                    })); 

                dfd.resolve(
                    Tracks.get().addTrack(scId, title, username, artworkUrl, 
                        this.get("id"), currentOrder + 1)
                );

            },this));

            return dfd.promise();
        },

        /*
            Get tracks associated with the list
        */
        getTracks : function(){
            // TODO: use the repository
            return new Tracks.Collection().getTracksForPlaylist(this.get("id"));
        },

        /*
            Cascase delete for all the tracks associated with the list
        */
        destroy : function(options){

            $.when(new Tracks.Collection().getTracksForPlaylist(this.get("id")))
                .done(function(tracks){
                    _.each(tracks,function(t){
                        t.destroy();
                    });
                }
            );

            return Backbone.Model.prototype.destroy.call(this,options); 
        }

    });

    /*
        Creating and fetching playlists
    */
    var PlaylistCollection = Backbone.Collection.extend({
        model: Playlist,
        localStorage: new Backbone.LocalStorage("stacks::playlist"),

        /*
            Title and description are optional, defaults are provided through
                - getDefaultTitle
                - getDefaultDescription
        */
        createPlaylist : function(title, description){
            var pl = this.create({ 
                title : !_.isUndefined(title) ? title : this.getDefaultTitle(), 
                description : !_.isUndefined(description) ? description : this.getDefaultDescription() },
                { wait : true }
            );            
            return pl;
        },

        /* 
            Helper for a getting all the playlists
        */ 
        getAllPlaylists : function(){
            
            var dfd = $.Deferred();

            $.when(this.fetch()).done(_.bind(function(){
                dfd.resolve(this.models);
            },this));

            return dfd.promise();
        },

        /* 
            Helper for a getting a specific playlist
        */ 
        getPlaylistById : function(id){
            var dfd = $.Deferred();

            $.when(this.fetch()).done(_.bind(function(){
                dfd.resolve(_.find(this.models, function(m){
                    return m.get("id") === id;
                }));
            },this));

            return dfd.promise();
        },

        /*
            Gets or creates a special playlist dedicated to storing bookmarked tracks
                - playlist title and description are available through 
        */
        getBookmarkingPlaylist : function(){
            var dfd = $.Deferred();

            $.when(this.getAllPlaylists()).done(_.bind(function(playlists){

                var bookmarkPlaylist = _.find(playlists,_.bind(function(pl){
                    return pl.get("title").toLowerCase() === 
                        this.getBookmarkingPlaylistTitle().toLowerCase();
                },this)); 

                if(typeof bookmarkPlaylist === 'undefined'){
                    bookmarkPlaylist = this.createPlaylist(
                        this.getBookmarkingPlaylistTitle(),
                        this.getBookmarkingPlaylistDescription()
                    );
                }
                
                setTimeout(function(){
                    dfd.resolve(bookmarkPlaylist);
                },100);

            },this));

            return dfd.promise();
        },

        getBookmarkingPlaylistTitle : function(){
            return "Bookmarks";
        },

        getBookmarkingPlaylistDescription : function(){
            return "These are your bookmarked tracks, hombre";
        },

        getDefaultTitle : function(){
            return "Click edits titles";
        },

        getDefaultDescription : function(){
            return "Click edits descriptions";
        }
    });

    return {
        Collection : PlaylistCollection
    };

});
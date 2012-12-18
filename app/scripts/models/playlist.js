define(["jquery", "underscore","backbone", "models/track", "backbone.localStorage"], function($,_,Backbone,Track){

    var Playlist = Backbone.Model.extend({
        addTrack : function(scId, title, username, artworkUrl){
            
            var dfd = $.Deferred();

            $.when(Track.get().getTracksForPlaylist(this.get("id"))).done(_.bind(function(tracks){

                var currentOrder = tracks.length === 0 ? 0 :
                    _.max(_.map(tracks, function(t){
                        return parseInt(t.get("playlistOrder"),10);
                    })); 

                var track = Track.get().addTrack(scId, title, username, artworkUrl, this.get("id"), currentOrder + 1);

                dfd.resolve(track);

                this.trigger("add", track);

            },this));

            return dfd.promise();
        },

        getTracks : function(){
            return new Track.Collection().getTracksForPlaylist(this.get("id"));
        },

        destroy : function(options){

            $.when(new Track.Collection().getTracksForPlaylist(this.get("id")))
                .done(function(tracks){
                    _.each(tracks,function(t){
                        t.destroy();
                    });
                }
            );

            return Backbone.Model.prototype.destroy.call(this,options); 
        }

    });

    var PlaylistCollection = Backbone.Collection.extend({
        model: Playlist,
        localStorage: new Backbone.LocalStorage("stacks::playlist"),

        createPlaylist : function(title, description){
            var pl = this.create({ 
                title : !_.isUndefined(title) ? title : this.getDefaultTitle(), 
                description : !_.isUndefined(description) ? description : this.getDefaultDescription() },
                { wait : true }
            );            
            return pl;
        },

        getAllPlaylists : function(){
            
            var dfd = $.Deferred();

            $.when(this.fetch()).done(_.bind(function(){
                dfd.resolve(this.models);
            },this));

            return dfd.promise();
        },

        getPlaylistById : function(id){
            var dfd = $.Deferred();

            $.when(this.fetch()).done(_.bind(function(){
                dfd.resolve(_.find(this.models, function(m){
                    return m.get("id") === id;
                }));
            },this));

            return dfd.promise();
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
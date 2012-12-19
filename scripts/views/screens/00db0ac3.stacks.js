/*
    Stacks screen is the main view of the app.
        - render playlists
        - display controls for adding new lists 

*/
define(["jquery", "underscore", "backbone", "handlebars", "text!templates/stacks.html",
        "views/controls/stack", "models/soundcloud.search"],
    function($, _, Backbone, Handlebars, stacksTemplate, StackView, SoundCloudSearch){

        var StacksView = Backbone.View.extend({

            template : Handlebars.compile(stacksTemplate),  
            className : "stacks loading",

            events : {
                "click .add" : "addPlaylist"
            },

            initialize : function(options){
                options = options || {};
                this.playlists = options.playlists;

                // grab all the playlists and keep track of any new ones
                if(typeof this.playlists !== 'undefined'){
                    $.when(this.playlists.getAllPlaylists()).done(
                        _.bind(this.onPlaylistsLoaded, this)
                    );
                    this.playlists.on("add", this.onPlaylistAdded, this);
                }
            },

            /*
                create a new playlist
            */
            addPlaylist : function(){
                this.playlists.createPlaylist();
                $(this.el).removeClass("empty");
            },

            /*
                handles a new playlist creation
            */
            onPlaylistAdded : function(playlist){
                this.displayPlaylist(playlist);
            },

            /*
                got all the playlists -> render the view
            */
            onPlaylistsLoaded : function(playlists){
                $(this.el).removeClass("loading");
                if(playlists.length === 0){
                    $(this.el).addClass("empty");
                }
                this.render();
            },

            /*
                render a playlist
            */
            displayPlaylist : function(playlist){
                $(this.el).children("ul").prepend(
                    new StackView({playlist : playlist, searchProvider : SoundCloudSearch}).render()
                );
            },

            render : function(){
                // when rendering the stacks, also adjust header state
                // the header does not have a dedicated view so we mess with it here
                $("header").removeClass("hidden");
                
                $(this.el).html(this.template());
                
                _.each(this.playlists.models, _.bind(function(pl){
                    this.displayPlaylist(pl);
                },this));

                return this.el;
            }

        });

        return StacksView;
    }
);
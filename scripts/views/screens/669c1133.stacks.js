define(["jquery", "underscore", "backbone", "handlebars", "text!templates/stacks.html",
        "views/controls/stack", "models/soundcloud.search"],
    function($, _, Backbone, Handlebars, stacksTemplate, StackView, SoundCloudSearch){

        var StacksView = Backbone.View.extend({

            template : Handlebars.compile(stacksTemplate),  
            className : "stacks loading",

            events : {
                "click .add" : "onAddPlaylist"
            },

            initialize : function(options){
                options = options || {};
                this.playlists = options.playlists;
                if(typeof this.playlists !== 'undefined'){
                    $.when(this.playlists.getAllPlaylists()).done(
                        _.bind(this.onPlaylistsLoaded, this)
                    );

                    this.playlists.on("add", function(playlist){                  
                        $(this.el).children("ul").prepend(
                            new StackView({playlist : playlist, searchProvider : SoundCloudSearch}).render()
                        );
                    }, this);
                }
            },

            onAddPlaylist : function(){
                this.playlists.createPlaylist();
                $(this.el).removeClass("empty");
            },

            onPlaylistsLoaded : function(playlists){
                $(this.el).removeClass("loading");
                if(playlists.length === 0){
                    $(this.el).addClass("empty");
                }

                this.render();
            },

            render : function(){
                $(this.el).html(this.template());
                
                _.each(this.playlists.models, _.bind(function(pl){
                    $(this.el).children("ul").append(
                        new StackView({ playlist : pl, searchProvider : SoundCloudSearch })
                            .render()
                    );
                },this));

                return this.el;
            }

        });

        return StacksView;
    }
);
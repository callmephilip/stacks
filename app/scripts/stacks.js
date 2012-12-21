/*
    Main application module
        - respond to routing events
        - navigate around using the router

    NB: the main router is not actaully started when testing
*/

define(['jquery','underscore',"soundcloud", "router", 
    "views/screens/stacks", "models/playlist", "models/bookmark"],
    function($,_,SC, ApplicationRouter,StacksView,Playlist, Bookmarks){

        /*
            Get SoundCloud application settings based on the host
                - dev settings when running locally
                - prod settings otherwise
            TDODO: this should come form an external source/service
        */
        function getSoundCloudSettings(){
            var local = window.location.host.indexOf("localhost") !== -1;
            return  local ? { //dev settings
                client_id: "5dd29681da42e534c05627eda4240299",
                redirect_uri: "http://localhost:3501/soundcloud.callback.html"
            } : { //production settings
                client_id: "75183d3e642d5c008a5fa0d33a6e7da5",
                redirect_uri: "http://callmephilip.github.com/stacks/soundcloud.callback.html"
            }
        }

        // get the soundcloud goodness ready go
        SC.initialize(getSoundCloudSettings());


        /*
            Main Application class
                - assumes it is supposed to use #container to display content
                - requires a router
        */
        var Application = function(router){
            this.router = router;
            this.root = $("#container");

            this.router.on("route:landing", this.landing, this);
            this.router.on("route:stacks", this.main,this);
            this.router.on("route:bookmark", this.bookmark, this);
        };

        Application.prototype = {
            
            /*
                Run the application
                    - optional whenCannotRun callback is triggered if there's no local storage access
            */
            run : function(whenCannotRun){

                try{
                    localStorage.setItem("can-i-haz-local-storage",1);
                }catch(e){
                    var app = this;

                    whenCannotRun = whenCannotRun || function(){
                        app.router.badBrowser();
                    };

                    whenCannotRun();
                }

                if(!this.testing()){
                    
                    //add a bookmarking component
                    try{
                        $("#bookmarker").attr("href",
                            "javascript:(function(){window.open('" + 
                                window.location.href.split("#")[0] + "#/bookmark/" + 
                            "'+encodeURIComponent(window.location.href));})();"
                        );
                    }catch(e){
                        console.error("Failed to integrate the bookmarker",e);
                    }

                    //no router when running tests
                    this.router.run();
                }
            },

            /* 
                landing screen 
                    -> jump to the main screen
            */
            landing : function(){
                this.router.main();
            },

            /*
                main application screen
                    - grab playlists
                    - render stacks
            */
            main : function(){
                var stacks = new StacksView({ playlists : new Playlist.Collection() });
                this.root.html(stacks.render());
            },

            /*
                processing a bookmarking request
            */
            bookmark : function(url){
                try{
                    $.when(Bookmarks.resolve(decodeURIComponent(url))).done(_.bind(function(bookmark){
                        
                        if(bookmark.isTrack()){
                                
                            //grab a dedicated bookmark playlist and add a new track
                            $.when(new Playlist.Collection().getBookmarkingPlaylist()).done(
                                _.bind(function(playlist){
                                    console.log("resolved", bookmark);
                                    var trackData = bookmark.data;
                                    playlist.addTrack(trackData.id, trackData.title, trackData.user.username, 
                                        trackData.artwork_url ? trackData.artwork_url : trackData.user_avatar_url);                             

                                    alert(trackData.title+" added to "+playlist.get("title"));

                                    this.router.main();

                                }, this)
                            );

                        } else {
                            alert("Cannot add this to Stacks. Sorry.");
                            this.router.main();
                        }
                        
                    },this)).fail(_.bind(function(e){
                        alert("Cannot add this to Stacks. Sorry.");
                        this.router.main();
                    },this));
                }catch(e){
                    alert("This does not look like a Soundcloud track url. Cannot compute.");
                    this.router.main();
                }
            },

            /* are we running tests? */
            testing : function(){
                return $("#mocha").length !== 0;
            }
        };

        var __instance;

        return {
            
            /*
                returns application instance
                    - if router is not provided, use defaults: router
            */
            getApplication : function(router,loginView){

                if(typeof __instance !== 'undefined'){
                    return __instance;
                }


                if((typeof router === 'undefined') || (typeof loginView === 'undefined')){
                    __instance = new Application(new ApplicationRouter());
                }   

                return __instance;
            }
        };
    }
);

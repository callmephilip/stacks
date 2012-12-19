/*
    Main application module
        - respond to routing events
        - navigate around using the router

    NB: the main router is not actaully started when testing
*/

define(['jquery','underscore',"soundcloud", "router", 
    "views/screens/login", "views/screens/stacks", "models/playlist"],
    function($,_,SC, ApplicationRouter,LoginView,StacksView, Playlist){

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
                - needs a router and a login view as configuration parameters
        */
        var Application = function(router,loginView){
            this.router = router;
            this.loginView = loginView;
            this.root = $("#container");

            this.router.on("route:landing", this.landing, this);
            this.router.on("route:login", this.login, this);
            this.router.on("route:stacks", this.main,this);

            this.loginView.on("login", function(){
                this.router.login();
            }, this);
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
                    //no router when running tests
                    this.router.run();
                }
            },

            /* 
                landing screen : say hi, get people to log in to SC (if needed) 
            */
            landing : function(){
                if(SC.isConnected()){
                    // TODO: figure out why this does NOT work
                    // seems like auth data is not persisted between page loads
                    //this.router.navigate("/stacks", {trigger:true});
                    this.router.main();
                } else {
                    this.root.html(this.loginView.render());
                }
            },

            /* 
                pop SC connection dialog 
            */
            login : function(){
                SC.connect(_.bind(function(){
                    this.router.main();
                },this));
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

            /* are we running tests? */
            testing : function(){
                return $("#mocha").length !== 0;
            }
        };

        var __instance;

        return {
            
            /*
                returns application instance
                    - if router or loginView are not provided, use defaults: router and screens/login
            */
            getApplication : function(router,loginView){

                if(typeof __instance !== 'undefined'){
                    return __instance;
                }


                if((typeof router === 'undefined') || (typeof loginView === 'undefined')){
                    __instance = new Application(new ApplicationRouter(), new LoginView());
                }   

                return __instance;
            }
        };
    }
);

define(['jquery','underscore',"soundcloud", "router", 
    "views/screens/login", "views/screens/stacks", "models/playlist"],
    function($,_,SC, ApplicationRouter,LoginView,StacksView, Playlist){

        SC.initialize(
            (window.location.host.indexOf("localhost") !== -1) ? 

            // Dev
            {
                client_id: "5dd29681da42e534c05627eda4240299",
                redirect_uri: "http://localhost:3501/soundcloud.callback.html"
            } 

            : 

            //Prod
            {
                client_id: "75183d3e642d5c008a5fa0d33a6e7da5",
                redirect_uri: "http://callmephilip.github.com/stacks/soundcloud.callback.html"
            }
        );


        
        var Application = function(router,loginView){
            this.router = router;
            this.loginView = loginView;
            this.root = $("#container");

            this.router.on("route:landing", function(){
                if(SC.accessToken()){
                    this.router.navigate("/stacks", {trigger:true});
                } else {
                    this.root.html(this.loginView.render());
                }

            }, this);

            this.router.on("route:login", function(){
                SC.connect(_.bind(function(){
                    this.router.navigate("/stacks", {trigger:true});
                },this));
            }, this);

            this.router.on("route:stacks", _.bind(function(){
                $("header").removeClass("hidden");
                var stacks = new StacksView({ playlists : new Playlist.Collection() });
                this.root.html(stacks.render());
            },this));

            this.loginView.on("login", function(){
                this.router.navigate("/login", {trigger:true});
            }, this);
        };

        Application.prototype = {
            run : function(whenCannotRun){
                
                try{
                    localStorage.setItem("can-i-haz-local-storage",1);
                }catch(e){
                    whenCannotRun = whenCannotRun || function(){
                        window.location.href = "/oops.html";
                    };

                    whenCannotRun();
                }

                if(!this.testing()){
                    this.router.run();
                }
            },

            testing : function(){
                return $("#mocha").length !== 0;
            }
        };

        var __instance;

        return {
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

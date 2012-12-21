/*
    Application url mapping
        - landing 
        - stacks (main application screen)
*/

define(['backbone'],
    function(Backbone) {
        var ApplicationRouter = Backbone.Router.extend({

            routes: {
                "stacks": "stacks",
                "bookmark/:url" : "bookmark",
                "*actions": "landing"
            },

            started : false,

            run : function(){
                if(!this.started){
                    Backbone.history.start();
                    this.started = true;
                }
            },

            landing : function(){
                this.navigate("/", {trigger:true});
            },

            main : function(){
                this.navigate("/stacks", {trigger:true});
            },

            /*
                if the app cannot be run within current browser 
            */
            badBrowser : function(){
                window.location.href = "/oops.html";
            }

        });

        return ApplicationRouter;
    }
);

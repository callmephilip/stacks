define(['jquery','underscore','backbone','handlebars'],
    function($,_,Backbone,Handlebars) {


        var ApplicationRouter = Backbone.Router.extend({

            routes: {
                "login": "login",
                "stacks": "stacks",
                "*actions": "landing"
            },

            started : false,

            run : function(){
                if(!this.started){
                    //Backbone.history.start({pushState: true});
                    Backbone.history.start();
                    this.started = true;
                }
            }

        });

        return ApplicationRouter;
    }
);

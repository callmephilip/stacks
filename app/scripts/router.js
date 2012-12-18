define(['backbone'],
    function(Backbone) {
        var ApplicationRouter = Backbone.Router.extend({

            routes: {
                "login": "login",
                "stacks": "stacks",
                "*actions": "landing"
            },

            started : false,

            run : function(){
                if(!this.started){
                    Backbone.history.start();
                    this.started = true;
                }
            }

        });

        return ApplicationRouter;
    }
);

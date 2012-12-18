define(["jquery","backbone","handlebars", "text!templates/controls/track.html"],
    function($,Backbone,Handlebars, trackTemplate){

    var TrackView = Backbone.View.extend({

        template : Handlebars.compile(trackTemplate),
        tagName : "li",
        className : "track",
        events : {
            "click .playback-button" : "onTogglePlayback",
            "click .delete-button" : "onDelete"
        },

        initialize : function(attributes){
            attributes = attributes || {};
            if(typeof attributes.model === 'undefined'){
                throw new Error("Model required");
            }

            this.model.on("change", this.onModelChanged, this);
        },

        onModelChanged : function(){
            if(this.model.hasChanged("state")){
                if(this.model.isPlaying()){
                    $(this.el).addClass("playing");        
                }else{
                    $(this.el).removeClass("playing");        
                }      
            }
        },

        onTogglePlayback : function(){
            $(this.el).toggleClass("playing");        
            this.model.togglePlayback();
        },

        onDelete : function(){
            this.model.destroy();
            $(this.el).remove();
        },

        render : function(){
            $(this.el).html(this.template(this.model.toJSON()));
            return this.el;
        }

    });  


    return TrackView;
});
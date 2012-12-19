/*
    Track views is rendered within a track list and it represents a track  
    that can be played, paused and deleted
*/

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

            //keep an eye on the underlying model
            this.model.on("change", this.onModelChanged, this);
        },

        /*
            Adjust track display based on the change in the state of the underlying model
        */
        onModelChanged : function(){
            if(this.model.hasChanged("state")){
                if(this.model.isPlaying()){
                    $(this.el).addClass("playing");        
                }else{
                    $(this.el).removeClass("playing");        
                }      
            }
        },

        /*
            Play/Pause
        */
        onTogglePlayback : function(){
            $(this.el).toggleClass("playing");        
            this.model.togglePlayback();
        },

        /*
            Delete underlying track data and remove the element from the container
        */
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
define(["underscore","backbone","soundcloud"],function(_,Backbone,SC){

    var SoundCloudCollection = Backbone.Collection.extend({
        sync : function(method, model, options){ 
            if(method === "read"){
                var dfd = new $.Deferred();

                SC.get(this.url, _.bind(function(r){
                    if(typeof options.success !== 'undefined'){
                        options.success(r);
                    }  
                    dfd.resolve(this);    
                },this));

                return dfd.promise();
            } else {
                throw new Error("Operation not supported");
            }
        }
    });

    return {
        Collection : SoundCloudCollection
    };

});
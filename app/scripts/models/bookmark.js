define(["jquery","underscore","soundcloud"],function($,_,SC){

    var Bookmark = function(url){
        if(!this.__isValidUrl(url)){
            throw new Error("Invalid url");
        }

        this.url = url;
    };

    Bookmark.prototype = {

        resolve : function(){
            var dfd = $.Deferred();
            SC.get('/resolve', { url : this.url }, _.bind(function(d){
                
                if(!d){
                  dfd.reject(d);  
                } else {
                    if(typeof d.errors !== 'undefined'){
                        dfd.reject(d);
                    } else {
                        this.data = d;
                        dfd.resolve(this);
                    }
                }

            },this));
            return dfd.promise();
        },

        __isValidUrl : function(url){
            var e = /^(http(s)*(:\/\/))*soundcloud.com\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)+/gi;
            return (typeof url !== 'undefined') ? url.match(new RegExp(e)) : false;
        }
    }

    return {
        Bookmark : Bookmark,
        get : function(url){
            return new Bookmark(url); 
        }
    };
});
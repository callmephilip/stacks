/*
    Bookmark model

    Resolves a given url to a data structure using SC /resolve
*/

define(["jquery","underscore","soundcloud"],function($,_,SC){

    var Bookmark = function(url){
        if(!this.__isValidUrl(url)){
            throw new Error("Invalid url");
        }

        this.url = url;
    };

    Bookmark.prototype = {

        /*
            Performs the resolution 
                - returns itself through a promise
                - returns error through fail 
        */
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

        /*
            Determines if a bookmark points to a track
        */
        isTrack : function(){
            if(this.data){
                return (typeof this.data.kind !== 'undefined') ? 
                    this.data.kind === 'track' : false;
            }else{
                return false;
            }
        },

        /*
            Valid url is
                - a url
                - with soundcloud.com domain
                - has at least one path component 
        */
        __isValidUrl : function(url){
            var e = /^(http(s)*(:\/\/))*soundcloud.com\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)+/gi;
            return (typeof url !== 'undefined') ? url.match(new RegExp(e)) : false;
        }
    }

    return {
        Bookmark : Bookmark,
        
        get : function(url){
            return new Bookmark(url); 
        },

        resolve : function(url){
            return new Bookmark(url).resolve(); 
        }
    };
});
/*
    Search bar view attached to every stack
        - uses a patched version of jquery.autocomplete with support for js callbacks
            (https://github.com/callmephilip/jQueryAutocompletePlugin)
        - triggers 'result' event on the target textbox it is attached to 
*/

define(["jquery", "underscore", "backbone", "views/controls/search.result", "jquery.autocomplete"], 
    function($,_,Backbone,SearchResultView){

    var SearchBarView = Backbone.View.extend({
        
        /*
            jquery.autocomplete configuration options
                - start search after the 1st symbol entered
                - render search results using SearchResultView
        */
        autocompleteOptions : {
            minChars: 1,
            formatItem: function(data) {
                return $(new SearchResultView(data).render()).html();
            }
        },

        /*
            search provider get injected into the constructor
        */
        initialize : function(attributes){
            attributes = attributes || {};  
            if(typeof attributes.searchProvider === 'undefined'){
                throw new Error("searchProvider required");
            }

            this.searchProvider = attributes.searchProvider;
        },

        /*
            returns results in the following format (cause jquery.aucomplete says so)
                [{data : , value :, result : }]
        */
        search : function(term){
            return this.searchProvider.search(term).pipe(function(r){
                return _.map(r.models, function(rr){
                    return { data : rr.toJSON(), value : rr.get("title"), result : rr.get("title") };
                });
            });
        },

        /*
            attaches itself to the provided textbox
        */
        render : function(target){
            if(typeof target === 'undefined'){
                throw new Error("now target provided for search bar");
            }

            $(target).autocomplete(_.bind(this.search,this), this.autocompleteOptions);
        }
    });

    return SearchBarView;

});
define(["jquery", "underscore", "backbone", "views/controls/search.result", "jquery.autocomplete"], 
    function($,_,Backbone,SearchResultView){

    var SearchBarView = Backbone.View.extend({
        
        autocompleteOptions : {
            minChars: 1,
            formatItem: function(data, i, n, value) {
                return $(new SearchResultView(data).render()).html();
            }
        },

        initialize : function(attributes){
            if(typeof attributes.searchProvider !== 'undefined'){
                this.searchProvider = attributes.searchProvider;
            }
        },

        search : function(term){
            return this.searchProvider.search(term).pipe(function(r){
                return _.map(r.models, function(rr){
                    return { data : rr.toJSON(), value : rr.get("title"), result : rr.get("title") };
                });
            });
        },

        render : function(target){
            if(typeof target === 'undefined'){
                throw new Error("now target provided for search bar");
            }

            $(target).autocomplete(_.bind(this.search,this), this.autocompleteOptions);
        }
    });

    return SearchBarView;

});
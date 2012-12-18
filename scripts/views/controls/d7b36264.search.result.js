define(["jquery","backbone","handlebars", "text!templates/controls/search.result.html"],
    function($,Backbone,Handlebars, searchResultTemplate){

    var SearchResultView = Backbone.View.extend({

        template : Handlebars.compile(searchResultTemplate),

        initialize : function(attributes){
            this.model = new Backbone.Model(attributes);
        },

        render : function(){
            $(this.el).html(this.template(this.model.toJSON()));
            return this.el;
        }

    });  


    return SearchResultView;
});
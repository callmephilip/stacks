require.config({

    shim: {
        'underscore' : {exports: '_' },
        'backbone' : { deps : ['underscore'], exports: 'Backbone'},
        'backbone.localStorage' : { deps : ['backbone'] },
        'jquery.autocomplete' : { deps : ['jquery']},  
        'jquery.jeditable' : { deps : ['jquery']},
        'handlebars' : { exports: 'Handlebars' },
        'tyler' : { deps : ['backbone'] },
        'soundcloud' : { exports: 'SC' }
    },

    paths: {
        jquery: 'vendor/jquery.min',
        backbone: 'vendor/backbone',
        "backbone.localStorage": "vendor/backbone.localStorage",
        "jquery.autocomplete" : "vendor/jquery.autocomplete",
        "jquery.jeditable" : "vendor/jquery.jeditable",
        underscore: 'vendor/underscore',
        handlebars: 'vendor/handlebars',
        text : 'vendor/text',
        tyler : 'vendor/backbone.tyler',
        soundcloud : 'vendor/soundcloud',
        models: 'models',
        views: 'views',
        templates: '../templates'
    }

});

require(['app'], function(app) {
});

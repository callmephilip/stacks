/*
	Initial login screen
		- triggers "login" event when login button is clicked
*/

define(["jquery","backbone", "handlebars", "text!templates/login.html"],
	function($, Backbone, Handlebars, loginTemplate){

		var LoginView = Backbone.View.extend({

			template : Handlebars.compile(loginTemplate),	
			className : "login",

			events : {
				"click .login-button" : "onLogin"
			},

			onLogin : function () {
				this.trigger("login");
			},

			render : function(){
				$(this.el).html(this.template());
				return this.el;
			}

		});

		return LoginView;

	}
);
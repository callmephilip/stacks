define(["jquery","views/screens/login"],function($,LoginView){

	describe("Views:Screens:Login", function(){
		describe("Module", function(){
			it("can be imported", function(){
				expect(LoginView).to.be.ok;
			});
		});

		describe("LoginView", function(){

			var view;

			beforeEach(function(){
				view = new LoginView();
			});

			it("can render itself using render()", function(){
				expect(LoginView).to.respondTo("render");
				expect(view.render()).to.be.ok;
			});

			it("renders itself as a div with class set to login", function(){
				expect($(view.render())).to.be("div.login");
			});

			it("has an element with a login-button class", function(){
				expect($(view.render())).to.have(".login-button");
			});

			it("triggers login event when login button is clicked", function(done){
				view.on("login", done);
				$(view.render()).find(".login-button").trigger("click");
			});

		});
	});

});

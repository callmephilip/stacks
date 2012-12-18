define(["jquery", "underscore", "stacks"],function($,_,StacksApplication){

    describe("Stacks:Application", function(){
        
        describe("Module", function(){
            it("can be imported", function(){
                expect(StacksApplication).to.be.ok;
            });

            it("has getApplication method", function(){
                expect(StacksApplication).to.respondTo("getApplication");
            });

            it("getApplication() returns something", function(){
                expect(StacksApplication.getApplication()).to.be.ok;
            });

            it("getApplication() returns the same object on the second call", function(){
                var app1 = StacksApplication.getApplication(),
                    app2 = StacksApplication.getApplication();  
                expect(app2).to.equal(app1);
            });
        });

        describe("Application", function(){

            afterEach(function(){
                if(typeof localStorage.setItem.restore !== 'undefined'){
                    localStorage.setItem.restore();
                }
            });

            it("says testing() is true when testing", function(){
                var app = StacksApplication.getApplication();
                expect(app.testing()).to.be.true;                
            });

            it("checks if localStorage is available first thing in the morning", function(done){
                var app = StacksApplication.getApplication(), localStorageCheckKey = "can-i-haz-local-storage";
                sinon.stub(localStorage,"setItem",function(k,v){
                    expect(k).to.equal(localStorageCheckKey);
                    expect(v).to.equal(1);
                    done();
                });

                app.run();
            });

            it("redirects to an informative page when local storage is disabled", function(){
                var app = StacksApplication.getApplication(), 
                    localStorageCheckKey = "can-i-haz-local-storage",
                    whenNoStorage = sinon.spy();
                

                sinon.stub(localStorage,"setItem",function(k,v){
                    throw new Error();
                });

                app.run(whenNoStorage);
                sinon.assert.calledOnce(whenNoStorage);

            });

        });

    });

});
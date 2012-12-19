define(["jquery", "underscore", "router"],function($,_,ApplicationRouter){

    describe("Router:ApplicationRouter", function(){
        
        describe("Module", function(){
            it("can be imported", function(){
                expect(ApplicationRouter).to.be.ok;
            });
        });

        describe('ApplicationRouter', function () {

            var router;

            before(function(){
                router = new ApplicationRouter();
                router.run();
            });

            afterEach(function(){
                if(typeof window.history.pushState.restore !== 'undefined'){
                    window.history.pushState.restore();
                }
            });

            function stubPushState(expectedUrl){
                var stub = sinon.stub(window.history, "pushState", function(data, title, url){
                    expect(url).to.equal(expectedUrl);
                });
            }

            function checkNavigation(url, route, done){
                stubPushState(url);

                router.on(route, function(){
                    done();
                });

                router.navigate(url, {trigger: true}); 
            }

            it('navigates to landing by default', function (done) {
                checkNavigation("/anything", "route:landing", done);
            });

            it('can navigate to /stacks', function(done){
                checkNavigation("/stacks", "route:stacks", done); 
            });            
        });
    });

});
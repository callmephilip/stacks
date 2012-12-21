define(["underscore","models/bookmark","soundcloud"],function(_,Bookmarks,SC){

    describe("Models::Bookmark", function(){

        describe("module", function(){

            it("can be imported", function(){
                expect(Bookmarks).to.be.ok;
            });

            it('exports get function', function(){
                expect(Bookmarks).to.respondTo("get");
            });

            it('exports Bookmark class', function(){
                expect(Bookmarks.Bookmark).to.be.ok;
            });

            it('get requires a url parameter', function(){
                function fn(){
                    Bookmarks.get();
                }
                expect(fn).to.throw("Invalid url");
            });
        });

        describe("Bookmark", function(){

            afterEach(function(){
                if(typeof SC.get.restore !== 'undefined'){
                    SC.get.restore();
                }
            });

            it("validates the url", function(){



                var invalidUrlGenerators = _.map(
                    ["ioeiwrpi233",
                     "http://google.com",
                     "http://soundcloud.com",
                     "http://google.com/?url=soundcloud.com"
                    ], function(url){
                    return function (){ new Bookmarks.Bookmark(url); };
                }); 
                 
                invalidUrlGenerators.push(
                    function (){ new Bookmarks.Bookmark(); }
                ); 
                
                function  goodUrls(){ 
                    var goodUrls = [
                        "https://soundcloud.com/jadedlondon/ralf-kollmann-at-jaded-9th",
                        "http://soundcloud.com/jadedlondon/ralf-kollmann-at-jaded-9th",
                        "soundcloud.com/jadedlondon/ralf-kollmann-at-jaded-9th"
                    ];

                    for(var i=0; i<goodUrls.length; i++){
                        new Bookmarks.Bookmark(goodUrls[i]);    
                    }
                } 

                for(var i=0; i<invalidUrlGenerators.length; i++){
                    expect(invalidUrlGenerators[i]).to.throw("Invalid url");    
                }

                expect(goodUrls).to.not.throw("Invalid url");
                
            });

            it("has resolve method", function(){
                expect(Bookmarks.Bookmark).to.respondTo('resolve')
            });

            it('resolves a bookmark using SC /resolve', function(done){
                var urlToResolve = "https://soundcloud.com/jadedlondon/ralf-kollmann-at-jaded-9th";

                sinon.stub(SC,'get',function(url,params,callback){
                    expect(url).to.equal("/resolve");
                    expect(params.url).to.equal(urlToResolve);

                    done();
                });

                new Bookmarks.Bookmark(urlToResolve).resolve();
            });

            it('sets data property the the value returned by the call to SC.resolve if it succeeds',function(done){                        
                var returnedData = { uri : 'some-uri', id : 'id' },
                    urlToResolve = "https://soundcloud.com/jadedlondon/ralf-kollmann-at-jaded-9th";

                sinon.stub(SC, 'get', function(url,params,callback){
                    callback(returnedData);
                });

                $.when(new Bookmarks.Bookmark(urlToResolve).resolve()).done(function(bookmark){
                    expect(bookmark.data).to.deep.equal(returnedData);
                    done();
                });    

            });

            it('reports failures through fail()', function(done){

                var urlToResolve = "https://soundcloud.com/jadedlondon/this-is-not-a-song";
                var error = { errors : [] };

                sinon.stub(SC, 'get', function(url,params,callback){
                    callback(error);
                });

                var bookmark = new Bookmarks.Bookmark(urlToResolve);

                $.when(bookmark.resolve()).fail(function(e1){
                    expect(bookmark.data).to.not.be.ok;
                    done();
                });

            });

        });        

    });

});
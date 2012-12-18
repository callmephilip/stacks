define(["models/soundcloud.search","soundcloud"], function(SoundCloudSearch,SC){

    describe("Models::SoundCloud::Search", function(){

        describe("module", function(){
            it("can be imported", function(){
                expect(SoundCloudSearch).to.be.ok;
            });

            it("exports search method", function(){
                expect(SoundCloudSearch).to.respondTo("search");
            });

            it("exports newSearchCollection method", function(){
                expect(SoundCloudSearch).to.respondTo("newSearchCollection");
            });

            it("newSearchCollection method returns something", function(){
                expect(SoundCloudSearch.newSearchCollection()).to.be.ok;
            });
        });


        describe("search", function(){

            var searchAPIResponse = {
                "tx_id":"b27693a27497492e89b982e9db7cebf9",
                "query_time_in_millis":0,
                "query":"bass so",
                "limit":5,

                "collection":[
                    {"kind":"user","id":495491,"score":4924},
                    {   
                        "kind":"track",
                        "id":45934679,
                        "artwork_url" : "https://i1.sndcdn.com/artworks-000036210803-37z6vv-t120x120.jpg?89afbb5",   
                        "title" : "song title",
                        "user" : {
                            avatar_url : "https://i1.sndcdn.com/artworks-000036210803-37z6vv-t120x120.jpg?89afbb5",
                            username : "username"
                        }
                    },
                    {"kind":"user","id":3926385,"score":4284},
                    {"kind":"user","id":555794,"score":3361},
                    {"kind":"user","id":5534899,"score":3197}
                ]
            };


            afterEach(function(){
                if(typeof SoundCloudSearch.newSearchCollection.restore !== 'undefined'){
                    SoundCloudSearch.newSearchCollection.restore();
                }                

                if(typeof SC.get.restore !== 'undefined'){
                    SC.get.restore();
                }
            });

            it("uses newSearchCollection", function(done){
                sinon.stub(SoundCloudSearch,"newSearchCollection", function(){
                    done();
                });
                SoundCloudSearch.search("nice song");
            });

            it("returns undefined if no query is provided", function(){
                expect(SoundCloudSearch.search()).to.not.be.ok;
            });

            
            it("passes a url to newSearchCollection in the following format: /search?q=[search terms]", function(done){
                var searchTerm = "song";
                sinon.stub(SoundCloudSearch,"newSearchCollection", function(url){
                    expect(url).to.equal("/search?q=" + searchTerm);                 
                    done();
                });
                SoundCloudSearch.search(searchTerm); 
            });

            it("properly escapes search term before passing it to newSearchCollection", function(done){
                var searchTerm = "yet another song + %%  %%%%";
                
                sinon.stub(SoundCloudSearch,"newSearchCollection", function(url){
                    expect(url).to.equal("/search?q=" + encodeURIComponent(searchTerm));                 
                    done();
                });

                SoundCloudSearch.search(searchTerm); 
            });

            it("correctly parses search results : populates models ignoring anything but tracks", function(done){

                sinon.stub(SC,'get', function(url,callback){
                    callback(searchAPIResponse);
                });

                $.when(SoundCloudSearch.search("song")).done(function(tracks){

                    console.log(tracks.models);

                    expect(tracks.models.length).to.equal(_.filter(searchAPIResponse["collection"], function(s){
                        return (s.kind === "track");
                    }).length);

                    expect(_.filter(tracks.models, function(m){
                        return m.has("query") || m.has("score");
                    }).length).to.equal(0);

                    done(); 
                });

            });


        });

    });

});
define(["views/controls/track", "models/track"],function(TrackView,Track){

    describe("Views::Controls::Track", function(){

        describe("module", function(){

            it("can be imported", function(){
                expect(TrackView).to.be.ok;
            });

        });

        describe("TrackView", function(){

            var track, 
                title =  "Ecuador Arriba Ecuadorr2 conduce Edwin Patricio", 
                username  = "edlocutor", 
                artworkUrl = "https://i1.sndcdn.com/artworks-000036315255-goc1yb-large.jpg?89afbb5", 
                view, 
                trackCollection = new Track.Collection();

            beforeEach(function(){
                track = trackCollection.addTrack(
                    71420992, title, username, artworkUrl, 1, 1
                );
                view = new TrackView({ model : track});
            });
            
            afterEach(function(){
                window.localStorage.clear();
            });

            it("requires a track model", function(){
                function fn(){ new TrackView(); }
                expect(fn).to.throw("Model required");
            });

            it("can render itself", function(){
                expect(view.render()).to.be.ok;
            });

            it("renders itself as a li with class set to track", function(){
                var html = $(view.render());
                expect(html).to.be("li.track");              
            });

            it("displays title, username and artwork", function(){
                var html = $(view.render());
                expect(html).to.contain(title);
                expect(html).to.contain(username);
                expect(html).to.have("img[src='" + artworkUrl + "']");
            });

            it("has a play/pause button", function(){
                var html = $(view.render());
                expect(html).to.have("a[class*='playback-button']"); 
            });

            it("toggles playback when play/pause button is clicked", function(done){

                sinon.stub(track, "togglePlayback", function(){
                    done();
                });
                
                var html = $((new TrackView({ model : track})).render()); 
                html.find("a[class*='playback-button']").trigger("click");
            });

            it("deletes underlying track when delete button is clicked", function(done){

                sinon.stub(track, "destroy", function(){
                    done();
                });
                
                var html = $((new TrackView({ model : track})).render()); 
                html.find("a[class*='delete-button']").trigger("click");
            });

            it("removes itself from the container when delete button is clicked", function(done){                
                var html = $((new TrackView({ model : track})).render()); 
                var container = jQuery("<div>").append(html);
                html.find("a[class*='delete-button']").trigger("click");
                setTimeout(function(){
                    expect($(container).children().length).to.equal(0);
                    done();    
                },200);
            });
        });

    });

});
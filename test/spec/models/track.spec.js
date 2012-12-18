define(["underscore", "models/track","soundcloud", "models/playlist"], 
    function(_,Track,SC,Playlist){

    describe("Models::Track", function(){

        describe("module", function(){

            var numberOfTracks = 5;

            afterEach(function(){
                $.when(Track.get().getTracks()).done(function(tracks){
                    _.each(tracks, function(t){
                        Track.deleteTrack(t);    
                    });
                });
            });

            beforeEach(function(done){
                
                window.localStorage.clear();

                $.when(Track.get().getTracks()).done(function(tracks){
                    
                    Track.addTrack("sc-id-1", "title", "username", "artworkUrl", "pl1", 1);
                    Track.addTrack("sc-id-2", "title", "username", "artworkUrl", "pl1", 2);
                    Track.addTrack("sc-id-3", "title", "username", "artworkUrl", "pl1", 3);
                    Track.addTrack("sc-id-4", "title", "username", "artworkUrl", "pl2", 1);
                    Track.addTrack("sc-id-5", "title", "username", "artworkUrl", "pl2", 2);
                
                    done();
                });

                
            });

            it("can be imported", function(){
                expect(Track).to.be.ok;
            });

            it("exports Collection", function(){
                expect(Track.Collection).to.be.ok;
            });

            it("can create tracks using addTrack", function(done){
                var c = new Track.Collection();

                $.when(c.fetch()).done(function(){
                    expect(c.models.length).to.equal(numberOfTracks);
                    done();
                });

            });

            // it("returns all tracks using getTracks without parameters", function(done){
            //     $.when(Track.get().getTracks()).done(function(tracks){
            //         expect(tracks.length).to.equal(numberOfTracks);
            //         done();
            //     });

            // });

            // it("returns all tracks with getTracks within a specific playlist  with parameters", function(done){
            //     var playlistId = "pl1";

            //     $.when(Track.get().getTracks(playlistId)).done(function(tracks){
            //         _.each(tracks, function(t){
            //             expect(t.get("playlistId") === playlistId);
            //         });
            //         done();
            //     });

            // });

        });

        

        describe("Collection", function(){
            var c;

            beforeEach(function(){
                c = new Track.Collection();
            });

            afterEach(function(){
                window.localStorage.clear();
            });

            it("supports addTrack", function(){
                expect(Track.Collection).to.respondTo("addTrack");
            });

            it("saves a track added with addTrack", function(done){
                var track = c.addTrack("sc-id", "title", "username", "artworkUrl", "playlistId", 1);

                expect(track).to.be.ok;

                var tracks = new Track.Collection(); 

                $.when(tracks.fetch()).done(function(){
                    
                    expect(tracks.models.length).to.equal(1);
                    expect(tracks.models[0].get("id")).to.not.equal("sc-id");
                    expect(tracks.models[0].get("artworkUrl")).to.equal("artworkUrl");
                    expect(tracks.models[0].get("playlistId")).to.equal("playlistId");
                    expect(tracks.models[0].get("playlistOrder")).to.equal(1);
                    expect(tracks.models[0].get("scId")).to.equal("sc-id");
                    expect(tracks.models[0].get("title")).to.equal("title");
                    expect(tracks.models[0].get("username")).to.equal("username");

                    done();
                });
            });

            it("gets all tracks associated with a given playlist", function(done){
                var tracks = [
                    c.addTrack("sc-id", "title", "username", "artworkUrl", "pl1", 1),
                    c.addTrack("sc-id", "title", "username", "artworkUrl", "pl1", 2),
                    c.addTrack("sc-id", "title", "username", "artworkUrl", "pl1", 3),

                    c.addTrack("sc-id", "title", "username", "artworkUrl", "pl2", 1),
                    c.addTrack("sc-id", "title", "username", "artworkUrl", "pl2", 2)
                ];

                $.when(
                    new Track.Collection().getTracksForPlaylist("pl1"),
                    new Track.Collection().getTracksForPlaylist("pl2")
                ).done(function(pl1, pl2){
                    
                    expect(pl1.length).to.equal(
                        _.filter(tracks, function(t){ return t.get("playlistId") === "pl1";}).length
                    );

                    expect(pl2.length).to.equal(
                        _.filter(tracks, function(t){ return t.get("playlistId") === "pl2";}).length
                    );

                    done();
                });  
            });

            it("can stream music from SoundCloud through getSound", function(done){

                var track = c.addTrack("sc-id", "title", "username", "artworkUrl", "pl1", 1);

                sinon.stub(SC, "stream", function(url){
                    expect(url).to.equal("/tracks/sc-id");
                    done();
                });

                track.getSound();

            });
        });

    });

});
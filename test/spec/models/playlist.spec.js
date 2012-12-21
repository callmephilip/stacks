define(["jquery", "underscore", "models/playlist", "models/track"], function($, _, Playlist,Track){

    describe("Models:Playlist", function(){

        describe("module", function(){
            it("can be imported", function(){
                expect(Playlist).to.be.ok;
            });

            it("exports Collection", function(){
                expect(Playlist.Collection).to.be.ok;
            });
        });

        describe("Collection", function(){

            var c;

            beforeEach(function(){
                c = new Playlist.Collection();
            });

            afterEach(function(){
                window.localStorage.clear();
            });

            it("supports defaults title and description", function(){
                expect(c.getDefaultTitle()).to.be.ok;
                expect(c.getDefaultDescription()).to.be.ok;
            });

            it("supports createPlaylist", function(){
                expect(Playlist.Collection).to.respondTo("createPlaylist");
            });

            it("creates playlist using backbone local storage implementation", function(done){
                var title="title", description = "description";
                sinon.stub(c, "create", function(attrs){
                    expect(attrs.title).to.equal(title);
                    expect(attrs.description).to.equal(description);
                    done();
                });
                c.createPlaylist(title,description);
            });

            it("createPlaylist returns a newly created playlist model", function(){
                var title="title", 
                    description = "description", 
                    playlist = c.createPlaylist(title,description); 

                expect(playlist).to.be.ok;
                expect(playlist.get("title")).to.equal(title);
                expect(playlist.get("description")).to.equal(description);
            });

            it("uses defaults for title and description if nothing is provided", function(done){
                sinon.stub(c, "create", function(attrs){
                    expect(attrs.title).to.equal(c.getDefaultTitle());
                    expect(attrs.description).to.equal(c.getDefaultDescription());
                    done();
                });
                c.createPlaylist();
            });

            it("supports getAllPlaylists", function(){
                expect(c).to.respondTo("getAllPlaylists");
            });

            it("uses backbone localStorage fetch in getAllPlaylists", function(done){
                sinon.stub(c, "fetch", function(attrs){
                    done();
                });
                c.getAllPlaylists();
            });

            it("returns playlists created by createPlaylist thru getAllPlaylists", function(done){
                var data = [
                    { title : "playlist1", description : "playlist1 desc" },
                    { title : "playlist2", description : "playlist2 desc" },
                    { title : "playlist3", description : "playlist3 desc" }
                ];

                _.each(data, function(d){ c.createPlaylist(d.title,d.description); });

                $.when(c.getAllPlaylists()).done(function(playlists){
                    expect(playlists.length).to.equal(data.length);

                    _.each(data, function(d){
                        expect(_.find(playlists, function(p){
                            return (p.get("title") === d.title) && (p.get("description") === d.description);
                        })).to.be.ok;
                    });

                    done();
                });                 
            });

            it("returns specific playlist given its id through getPlaylistById", function(done){
                
                var playlist = c.createPlaylist();

                $.when(
                    new Playlist.Collection().getPlaylistById(playlist.get("id"))
                ).done(function(pl){
                    expect(pl.get("id")).to.equal(playlist.get("id"));
                    done();
                });                 
            });

            it("adds track to a playlist using addTrack", function(done){
                var playlist = c.createPlaylist();
                track = playlist.addTrack("sc-id", "title", "username", "artworkUrl");
                
                $.when(playlist.addTrack("sc-id", "title", "username", "artworkUrl")).done(function(track){
                    expect(track).to.be.ok;
                    expect(track.get("playlistId")).to.equal(playlist.get("id"));
                    done();
                });
            });

            it("manages track ordering", function(done){
                var playlist = c.createPlaylist();
                $.when(
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl"),
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl"),
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl"),
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl")
                ).done(function(t1,t2,t3,t4){
                    for(var i=0; i<arguments.length; i++){
                        expect(arguments[i].get("playlistOrder")).to.equal(i+1);    
                    }

                    done();
                });
            });

            it("gets all tracks thru getTracks", function(done){
                var playlist = c.createPlaylist();
                $.when(
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl"),
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl"),
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl"),
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl")
                ).done(function(t1,t2,t3,t4){
                    $.when(playlist.getTracks()).done(function(tracks){
                        expect(tracks.length).to.equal(4);
                        done();
                    });
                });
            });

            it("supports getBookmarkingPlaylist method", function(){
                expect(Playlist.Collection).to.respondTo("getBookmarkingPlaylist");
            });

            it("supports getBookmarkingPlaylistTitle method", function(){
                expect(Playlist.Collection).to.respondTo("getBookmarkingPlaylistTitle");
            });

            it("supports getBookmarkingPlaylistDescription method", function(){
                expect(Playlist.Collection).to.respondTo("getBookmarkingPlaylistDescription");
            });

            it("creates a bookmarking playlist in getBookmarkingPlaylist if it's not available", function(done){
                $.when(c.getBookmarkingPlaylist()).done(function(playlist){
                    expect(playlist).to.be.ok;
                    expect(playlist.get("title")).to.equal(c.getBookmarkingPlaylistTitle());
                    expect(playlist.get("description")).to.equal(c.getBookmarkingPlaylistDescription());
                    done();
                });
            });

            it("reuses an existing bookmarking playlist in getBookmarkingPlaylist", function(done){
                var bookmarkplaylist = c.createPlaylist(
                    c.getBookmarkingPlaylistTitle(),
                    c.getBookmarkingPlaylistDescription()
                );

                $.when(c.getBookmarkingPlaylist()).done(function(playlist){
                    expect(playlist).to.be.ok;
                    expect(playlist.get("id")).to.equal(bookmarkplaylist.get("id"));
                    done();
                });
            });

        });

        describe("Model", function(done){

            var c;

            beforeEach(function(){
                c = new Playlist.Collection();
            });

            afterEach(function(){
                window.localStorage.clear();
            });

            it("deletes all associated tracks on delete", function(done){
                var playlist = c.createPlaylist(), playlistId = playlist.get("id");
                $.when(
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl"),
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl"),
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl"),
                    playlist.addTrack("sc-id", "title", "username", "artworkUrl")
                ).done(function(t1,t2,t3,t4){
                    playlist.destroy();

                    $.when(new Track.Collection().getTracksForPlaylist(playlistId))
                        .done(function(tracks){
                            expect(tracks.length).equal(0);
                            done();
                        });

                });
            });

        });

    });

});
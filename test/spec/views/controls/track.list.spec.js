define(["underscore", "views/controls/track.list","models/track","models/playlist"], 
    function(_,TrackListView,Track,Playlist){

    describe("Views::Controls:TrackList", function(){

        describe("module", function(){
            it("can be imported", function(){
                expect(TrackListView).to.be.ok;
            });
        });

        describe("TrackList", function(){

            var playlist = new Playlist.Collection().createPlaylist(), 
                view,
                data = [
                    {   id : "id1", title : "title1", 
                        username : "username1", 
                        artworkUrl : "https://i1.sndcdn.com/artworks-000036315255-goc1yb-large.jpg?89afbb51", 
                        plid : 1, plo : 1 
                    },
                    {   id : "id2", title : "title2", 
                        username : "username2", 
                        artworkUrl : "https://i1.sndcdn.com/artworks-000036315255-goc1yb-large.jpg?89afbb52", 
                        plid : 1, plo : 2 
                    },
                    {   id : "id3", title : "title3", 
                        username : "username3", 
                        artworkUrl : "https://i1.sndcdn.com/artworks-000036315255-goc1yb-large.jpg?89afbb53", 
                        plid : 1, plo : 3 
                    }
                ];

            beforeEach(function(){
                _.each(data, function(d){
                    playlist.addTrack(d.id, d.title, d.username, d.artworkUrl);
                });

                view = new TrackListView({playlistId : playlist.get("id")});
            });
            
            afterEach(function(){
                window.localStorage.clear();
            });

            it("can render itself", function(){
                expect(view.render()).to.be.ok;
            });

            it("renders as a ul with class set to tracks", function(){
                expect(view.render()).to.be("ul.tracks");
            });

            it("contains titles, usernames of tracks within the tracklist", function(done){
                var html = $(view.render());
                setTimeout(function(){
                    _.each(data, function(d){
                        _.each([d.title, d.username], function(v){
                            expect(html.children()).to.contain(v);
                        });
                    });

                    done();

                },200);
            });

        });

    });

});
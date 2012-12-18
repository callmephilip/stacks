define(["views/controls/stack","models/playlist","models/soundcloud.search"],
    function(StackView, Playlist, SoundCloudSearch){

    describe("Views::Controls::Stack",function(){

        describe("module", function(){

            it("can be imported", function(){
                expect(StackView).to.be.ok;
            });

        });

        describe("Stack View", function(){

            var view, 
                data = [
                    { title : "playlist1", description : "playlist1 desc" },
                    { title : "playlist2", description : "playlist2 desc" },
                    { title : "playlist3", description : "playlist3 desc" }
                ],
                playlists = new Playlist.Collection();

            beforeEach(function(){
                _.each(data, function(d){ playlists.createPlaylist(d.title,d.description); });
                view = new StackView({ playlist : playlists.first(), searchProvider : SoundCloudSearch });
            }); 

            afterEach(function(){
                window.localStorage.clear();
            });

            it("renders itself as a li with class set to stack", function(){
                expect($(view.render())).to.be("li.stack");
            });

            it("contains playlist title and description", function(){
                expect($(view.render())).to.contain(data[0].title);
                expect($(view.render())).to.contain(data[0].description);
            });

            it("has a text box with class search", function(){
                expect($(view.render()).find("input[type='text'][class*='search']").length).to.equal(1);
            });

            it("triggers soundcloud search when search box content changes", function(done){
                var searchQuery = "song";

                sinon.stub(SoundCloudSearch,'search', function(term){
                    expect(term).to.equal(searchQuery);
                    done();
                    return $.Deferred().promise();
                });

                $(view.render()).find(".search").attr("value",searchQuery).trigger("keydown");
            });
        });

    });

});
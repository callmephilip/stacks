define(["jquery", "underscore", "views/screens/stacks","models/playlist"],function($,_,StacksView,Playlist){

	describe("Views:Screens:Stacks", function(){
		describe("Module", function(){
			it("can be imported", function(){
				expect(StacksView).to.be.ok;
			});
		});

        describe("StacksView", function(){

            var data = [
                    { title : "playlist1", description : "playlist1 desc" },
                    { title : "playlist2", description : "playlist2 desc" },
                    { title : "playlist3", description : "playlist3 desc" }
                ], playlists, view;

            beforeEach(function(){
                window.localStorage.clear();

                playlists = new Playlist.Collection();
                _.each(data, function(d){ playlists.createPlaylist(d.title,d.description); });
                view = new StacksView({ playlists : playlists });
            });

            it("can render itself using render()", function(){
                expect(view).to.respondTo("render");
                expect(view.render()).to.be.ok;
            });

            it("renders itself as a div with class set to stacks", function(){
                expect($(view.render())).to.be("div.stacks");
            });

            it("contains a ul", function(){
                expect($(view.render())).to.have("ul");
            });

            it("loads playlist using Playlist data source", function(done){
                var view = new StacksView({ playlists : { getAllPlaylists : function(){ 
                    done();
                } } });
            });

            it("removes loading class when data is loaded", function(){
                expect($(view.render())).to.not.have.class("loading");  
            });

            it("has empty class if no data is available", function(){
                
                while(playlists.models.length !== 0){
                    playlists.first().destroy();
                }

                var view = new StacksView({ playlists : playlists });
                expect($(view.render())).to.have.class("empty");   
            });

            it("rerenders itself when data is loaded", function(done){
                
                sinon.stub(playlists, "getAllPlaylists", function(){
                    var dfd = $.Deferred();
                    setTimeout(function(){ dfd.resolve([]); },100);
                    return dfd.promise();
                });

                var view = new StacksView({ playlists : playlists }), 
                    renderSpy = sinon.spy(view, "render"); 

                setTimeout(function(){
                    expect(renderSpy.calledOnce).to.be.true;
                    done();
                },200);
            });

            it("renders all the playlists as li's with class set to stack", function(done){

                var view = new StacksView({ playlists : playlists});
                var html = view.render();

                setTimeout(function(){
                    console.log(html);

                    expect($(html).find("li.stack").length).to.equal(data.length);  
                    done();  
                }, 100);

            });

            it("renders an add stack control as a link with class set to add", function(done){

                var view = new StacksView({ playlists : playlists});
                var html = view.render();

                setTimeout(function(){
                    expect($(html).find("a.add").length).to.equal(1);  
                    done();  
                }, 100);

            });

            it("renders an empty data template as li with class set to no-stacks", function(done){

                var view = new StacksView({ playlists : playlists});
                var html = view.render();

                setTimeout(function(){
                    expect($(html).find("li.no-stacks").length).to.equal(1);  
                    done();  
                }, 100);
            });

            it("adds a new playlist when add stack is clicked", function(done){
                var view = new StacksView({ playlists : playlists });
                var html = view.render();

                $(html).find("a.add").trigger("click");

                setTimeout(function(){
                    expect($(html).find("li.stack").length).to.equal(data.length + 1);
                    done();
                }, 100);
            });

        });
	});

});

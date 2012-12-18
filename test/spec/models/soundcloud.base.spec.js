define(["underscore","models/soundcloud.base","soundcloud"],function(_,SoundCloudModels,SC){

    describe("Models:SoundCloud:Base", function(){

        describe("Module", function(){

            it("can be imported", function(){
                expect(SoundCloudModels).to.be.ok;  
            });
            
            it("exports Collection", function(){
                expect(SoundCloudModels.Collection).to.be.ok;
            });

        });

        describe("SoundCloud Collection", function(){

            var dataUrl = "/search?q=song";

            beforeEach(function(){
                collection = new SoundCloudModels.Collection();
                collection.url = dataUrl;
            });

            afterEach(function(){
                SC.get.restore();
            });

            function stubSC(dataUrl,done){
                sinon.stub(SC, "get", function(url, callback){
                    expect(url).to.equal(dataUrl);
                    if(typeof done !== 'undefined'){
                        done();    
                    }

                    setTimeout(function(){callback();},300);
                });
            }

            it("calls SC.get on fetch passing it a given url", function(done){
                stubSC(dataUrl, done);
                collection.fetch();
            });

            it("resolves a promise upon successful fetch and returns a reference to itself", function(done){
                stubSC(dataUrl);
                var promise = collection.fetch();

                $.when(promise).done(function(r){
                    expect(r).to.equal(collection);
                    done();
                });

            });

            it("creates underlying models based on JSON returned by SC", function(done){
                var data = [
                    {id : 1, title : "track1" },
                    {id : 2, title : "track2" },
                    {id : 3, title : "track3" }
                ];

                sinon.stub(SC, "get", function(url, callback){
                    callback(data);

                    expect(collection.models.length).to.equal(data.length);
                    
                    _.each(data, function(d){
                        expect(_.find(collection.models, function(m){
                            return (m.get("id") === d.id) && (m.get("title") === d.title);
                        })).to.be.ok;
                    });

                    done();

                });    

                collection.fetch();
            });

        });

    });

});
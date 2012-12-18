define(["jquery", "underscore", "backbone", "handlebars", 
    "text!templates/controls/stack.html", 
    "models/track",
    "views/controls/searchbar", "views/controls/track.list", "jquery.jeditable"],
    function($, _, Backbone, Handlebars, stackTemplate, Tracks, SearchBarView, TrackListView){

        function plesantSurprise(){
            return "pleasant-surprise-" + 
                (function getRandomInt (min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                })(1,5);
        } 

        var StackView = Backbone.View.extend({
            template : Handlebars.compile(stackTemplate),  
            tagName: "li",
            className: "stack",

            events : {
                "result .search" : "onSearchResultSelected",
                "click .search" : "onSearchBoxClicked",
                "click .list-playback-button" : "onToggleListPlayback",
                "click .delete-stack-button" : "onDeleteStack"
            },

            initialize : function(options){
                options = options || {};
                
                if(typeof options.playlist !== 'undefined'){
                    this.playlist = options.playlist;
                    this.trackListView = new TrackListView({ 
                        playlistId : this.playlist.get("id")
                    });
                    this.trackListView.on("playbackStateChanged", function(state){
                        if(state === 'playing'){
                            $(this.el).addClass("active");                  
                        } else {
                            $(this.el).removeClass("active");                  
                        }

                    },this);
                }

                if(typeof options.searchProvider !== 'undefined'){
                    this.searchbar = new SearchBarView({searchProvider : options.searchProvider});
                }
            },

            onSearchResultSelected : function(e,data,title){ 
                this.playlist.addTrack(
                    data.id, data.title, data.user_username, 
                    data.artwork_url ? data.artwork_url : data.user_avatar_url
                );
            },

            onSearchBoxClicked : function(){
                this.$(".search").select();
            },

            onToggleListPlayback : function(){

                if(!this.trackListView.gotTunes()){
                    alert('Sorry got no tunes to play. Use the search bar above to find something nice.');
                } else {
                    $(this.el).toggleClass("active");
                    if(typeof this.trackListView !== 'undefined'){
                        this.trackListView.onPlayAllToggle();
                    }
                }
            },

            onDeleteStack : function(){
                if(confirm('Easy broski. This will kill your lovely stack and all the tunes in it (and yeah, I have not implemented the undo). Proceed?')){
                    this.trackListView.stopAllMusic();
                    this.playlist.destroy();
                    $(this.el).remove();
                }
            },

            render : function(){
                $(this.el).html(this.template(
                    typeof this.playlist !== 'undefined' ? this.playlist.toJSON() : {}
                ));

                this.searchbar.render(this.$(".search"));
                
                this.$(".title").editable(_.bind(function(value, settings){
                    this.playlist.set({ title : value }).save();
                    return value;
                },this), { onblur : 'submit', select : true });

                this.$(".description").editable(_.bind(function(value, settings){
                    this.playlist.set({ description : value }).save();
                    return value;
                },this), { onblur : 'submit', select : true  });

                if(typeof this.trackListView !== 'undefined'){
                    $(this.el).append(this.trackListView.render());
                }

                $(this.el).addClass(plesantSurprise());

                return this.el;
            }

        });

        return StackView;
    }
);
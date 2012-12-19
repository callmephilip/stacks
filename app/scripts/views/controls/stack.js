/*
    StackView displays a central element of the app - a stack which consists of
        - a list of tracks
        - a search bar with autocomplete search functionality
        - editable title and description
        - stack deletion button
        - PlayAll button

*/

define(["jquery", "underscore", "backbone", "handlebars", 
    "text!templates/controls/stack.html", 
    "views/controls/searchbar", "views/controls/track.list", "jquery.jeditable"],

    function($, _, Backbone, Handlebars, stackTemplate, SearchBarView, TrackListView){

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
                // fires when a search result selected in the dropdown
                "result .search" : "onSearchResultSelected",
                // respond to a click in the search box
                "click .search" : "onSearchBoxClicked",
                // handle play all option
                "click .list-playback-button" : "onToggleListPlayback",
                // handle delete stack button click
                "click .delete-stack-button" : "onDeleteStack"
            },

            initialize : function(options){
                options = options || {};
                
                if(typeof options.playlist !== 'undefined'){
                    this.playlist = options.playlist;

                    // initialize track list view
                    this.trackListView = new TrackListView({ playlistId : this.playlist.get("id") });
                    this.trackListView.on("playbackStateChanged", this.onPlaybackStateChanged,this);
                }

                if(typeof options.searchProvider !== 'undefined'){
                    // initialize the search bar
                    this.searchbar = new SearchBarView({searchProvider : options.searchProvider});
                }
            },

            /*
                Fires when one of the tracks in the tracklist changes its playback state
            */
            onPlaybackStateChanged : function(state){
                if(state === 'playing'){
                    $(this.el).addClass("active");                  
                } else {
                    $(this.el).removeClass("active");                  
                }
            },

            /*
                Use the selected search result to add a new track to the playlist 
            */
            onSearchResultSelected : function(e,data){ 
                this.playlist.addTrack(
                    data.id, data.title, data.user_username, 
                    data.artwork_url ? data.artwork_url : data.user_avatar_url
                );
            },

            /*
                TODO: remove this, delete text in the box after search instead of keeping it there
            */
            onSearchBoxClicked : function(){
                this.$(".search").select();
            },

            /*
                Play All/Pause button clicked -> propagate it to the playlist
            */
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

            /*
                Deleteing the stack
                    - stop the music before deleting the stack
                    - empty the playlist
            */
            onDeleteStack : function(){
                if(confirm('Easy broski. This will kill your lovely stack and all the tunes in it (and yeah, I have not implemented the undo). Proceed?')){
                    this.trackListView.stopAllMusic();
                    this.playlist.destroy();
                    $(this.el).remove();
                }
            },

            /*
                Helper for enabling in-place editing on specific elements
            */
            makeEditable : function(target, callback){
                if(typeof target === 'undefined'){
                    throw new Error("needs a target item");
                }

                if(typeof callback === 'undefined'){
                    throw new Error("needs a callback");   
                }

                $(target).editable(
                    function(value){
                        callback(); return value;
                    }, 
                    { //jquery.editable options 
                        onblur : 'submit', //save changes on blur  
                        select : true      //select before editing
                    }
                );
            },

            updateTitle : function(newTitle){
                this.playlist.set({ title : newTitle }).save();
            },

            updateDescription : function(newDescription){
                this.playlist.set({ description : newDescription }).save();
            },

            render : function(){

                // render stack template
                $(this.el).html(this.template(
                    typeof this.playlist !== 'undefined' ? this.playlist.toJSON() : {}
                ));

                // attach autocomplete to the search bar
                this.searchbar.render(this.$(".search"));
                
                // make title and description editable

                this.makeEditable(this.$(".title"), _.bind(this.updateTitle,this));
                this.makeEditable(this.$(".description"), _.bind(this.updateDescription,this));                    
                
                // render the tracklist
                if(typeof this.trackListView !== 'undefined'){
                    $(this.el).append(this.trackListView.render());
                }

                // add some random colors to the stacks
                $(this.el).addClass(plesantSurprise());

                return this.el;
            }

        });

        return StackView;
    }
);
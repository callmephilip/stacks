define(['jquery','underscore','backbone','stacks'],
    function($,_,Backbone,Application) {
        $(document).ready(function(){

            function testing(){
                return $('#mocha').length !== 0;
            }

            if(!testing()){
                console.log("So you too like to look under the hood?");
                new Application.getApplication().run();
            }
        });
    }
);

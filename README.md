# SoundCloud Dev Challenge turned a weekend project

'Stacks' is a SoundCloud based playlist manager. 

## Project structure

Fairly standard yeoman setup. When runnig locally, make sure you have a symbolic to app/scripts from the test directory

```
ln -s app/scripts test/scripts
``` 

To run locally

```
yeoman server
```

To test locally

```
yeoman test
```

## Libraries

* [require.js](https://github.com/jrburke/requirejs) for AMD
* [Backbone.js](https://github.com/documentcloud/backbone) for MVC
* [Backbone.localstorage](https://github.com/jeromegn/Backbone.localStorage) for localStorage based models
* [Handlebars](https://github.com/wycats/handlebars.js) for templates and belated Movember support
* Patched version of [jquery.autocomplete](https://github.com/callmephilip/jQueryAutocompletePlugin)
* [jquery.jeditable](https://github.com/tuupola/jquery_jeditable) for in-place editting
* [SoundCloud JS sdk](https://github.com/soundcloud/soundcloud-javascript) for the tunes and OAuth

Tested with [Mocha](https://github.com/visionmedia/mocha), [Chai](https://github.com/chaijs/chai) and [Sinon](https://github.com/cjohansen/Sinon.JS)

See app/scripts/vendor and test/lib for more details.

## Visuals

Homemade SASS. Beautiful icons are made by [Jamison Wieser](http://thenounproject.com/jamison/). BG is [Norwegian Rose](http://subtlepatterns.com/norwegian-rose/) by Fredrik Scheide.  


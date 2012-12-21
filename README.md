# SoundCloud Dev Challenge

'Stacks' is a SoundCloud based playlist manager. Live demo is [here](http://callmephilip.github.com/stacks/). 

## Note to SoundClouders

I have been continuing to work on Stacks after submitting the challenge:
* polishing things here and there
* bookmarklet feature

## Note to CS majors

Most playlists are technically FIFO queues (as oppposed to LIFO stacks). Project name refers to a less geeky meaning of the term

```
stack noun \ˈstak\

- an orderly pile or heap
- a large quantity or number
```

source : http://www.merriam-webster.com/dictionary/stack

## Project structure

Fairly standard [yeoman](http://yeoman.io/) setup. When runnig locally, make sure to link to app/scripts from the test directory

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
* [Handlebars](https://github.com/wycats/handlebars.js) for templates and belated Movember
* Patched version of [jquery.autocomplete](https://github.com/callmephilip/jQueryAutocompletePlugin)
* [jquery.jeditable](https://github.com/tuupola/jquery_jeditable) for in-place editting
* [SoundCloud JS sdk](https://github.com/soundcloud/soundcloud-javascript) for the tunes and OAuth

Tested with [Mocha](https://github.com/visionmedia/mocha), [Chai](https://github.com/chaijs/chai) and [Sinon](https://github.com/cjohansen/Sinon.JS)

See app/scripts/vendor and test/lib for more details.

## Visuals

Homemade SASS. Beautiful icons are made by [Jamison Wieser](http://thenounproject.com/jamison/) and [Mateo Zlatar](http://thenounproject.com/mateozlatar). Header background is [Norwegian Rose](http://subtlepatterns.com/norwegian-rose/) by Fredrik Scheide.  

## License

MIT licensed

Copyright (C) 2012 Philip Nuzhnyi
'use strict';

var libQ = require('kew');
var fs=require('fs-extra');
var config = new (require('v-conf'))();
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;


module.exports = volavdspio;
function volavdspio(context) {
	var self = this;

	this.context = context;
	this.commandRouter = this.context.coreCommand;
	this.logger = this.context.logger;
	this.configManager = this.context.configManager;

}

volavdspio.prototype.setreboot = function () {
  const self = this;
  
    socket.emit('reboot');
};


volavdspio.prototype.onVolumioStart = function()
{
	var self = this;
	var configFile=this.commandRouter.pluginManager.getConfigurationFile(this.context,'config.json');
	this.config = new (require('v-conf'))();
	this.config.loadFile(configFile);

    return libQ.resolve();
}

volavdspio.prototype.onStart = function() {
    var self = this;
	var defer=libQ.defer();


	// Once the Plugin has successfull started resolve the promise
	defer.resolve();

    return defer.promise;
};

volavdspio.prototype.onStop = function() {
    var self = this;
    var defer=libQ.defer();

    // Once the Plugin has successfull stopped resolve the promise
    defer.resolve();

    return libQ.resolve();
};

volavdspio.prototype.onRestart = function() {
    var self = this;
    // Optional, use if you need it
};


// Configuration Methods -----------------------------------------------------------------------------

volavdspio.prototype.getUIConfig = function() {
    var defer = libQ.defer();
    var self = this;

    var lang_code = this.commandRouter.sharedVars.get('language_code');

    self.commandRouter.i18nJson(__dirname+'/i18n/strings_'+lang_code+'.json',
        __dirname+'/i18n/strings_en.json',
        __dirname + '/UIConfig.json')
        .then(function(uiconf)
        {


            defer.resolve(uiconf);
        })
        .fail(function()
        {
            defer.reject(new Error());
        });

    return defer.promise;
};

volavdspio.prototype.getConfigurationFiles = function() {
	return ['config.json'];
}

volavdspio.prototype.setUIConfig = function(data) {
	var self = this;
	//Perform your installation tasks here
};

volavdspio.prototype.getConf = function(varName) {
	var self = this;
	//Perform your installation tasks here
};

volavdspio.prototype.setConf = function(varName, varValue) {
	var self = this;
	//Perform your installation tasks here
};

//here we save thevolumio config for the next plugin start
volavdspio.prototype.saveVolumioconfig = function () {
    var self = this;

    return new Promise(function (resolve, reject) {

      var cp = execSync('/bin/cp /data/configuration/audio_interface/alsa_controller/config.json /tmp/vconfig.json');
      var cp2 = execSync('/bin/cp /data/configuration/system_controller/i2s_dacs/config.json /tmp/i2sconfig.json');
      try {
        var cp3 = execSync('/bin/cp /boot/config.txt /tmp/config.txt');
      } catch (err) {
        self.logger.info('config.txt does not exist');
      }
      resolve();
    });
  };

//here we define the volumio restore config
volavdspio.prototype.restoreVolumioconfig = function () {
    var self = this;
    var defer = libQ.defer();
    //return new Promise(function(resolve, reject) {
    setTimeout(function () {
      var cp = execSync('/bin/cp /tmp/vconfig.json /data/configuration/audio_interface/alsa_controller/config.json');
      var cp2 = execSync('/bin/cp /tmp/i2sconfig.json /data/configuration/system_controller/i2s_dacs/config.json');
      try {
        var cp3 = execSync('/bin/cp /tmp/config.txt /boot/config.txt');
      } catch (err) {
        self.logger.info('config.txt does not exist');
      }
    }, 8000)
    defer.resolve()
    return defer.promise;
  };

//here we define functions used when autoconf is called
volavdspio.prototype.autoconfig = function () {
  var self = this;
  var defer = libQ.defer();
  self.saveVolumioconfig()
    //.then(self.modprobeLoopBackDevice())
    //.then(self.createASOUNDFile())
    //.then(self.saveHardwareAudioParameters())
    //.then(self.setalsaequaloutput())
    //  .then(self.setVolumeParameters())
    //  .then(self.restoreVolumioconfig())
    //  .then(self.bridgeLoopBackequal())
    .catch(function (err) {
      console.log(err);
    });
  defer.resolve()
  return defer.promise;
};

volavdspio.prototype.getLabelForSelect = function (options, key) {
  var n = options.length;
  for (var i = 0; i < n; i++) {
    if (options[i].value == key)
      return options[i].label;
  }
  return 'VALUE NOT FOUND BETWEEN SELECT OPTIONS!';
};


// Playback Controls ---------------------------------------------------------------------------------------
// If your plugin is not a music_sevice don't use this part and delete it


volavdspio.prototype.addToBrowseSources = function () {

	// Use this function to add your music service plugin to music sources
    //var data = {name: 'Spotify', uri: 'spotify',plugin_type:'music_service',plugin_name:'spop'};
    this.commandRouter.volumioAddToBrowseSources(data);
};

volavdspio.prototype.handleBrowseUri = function (curUri) {
    var self = this;

    //self.commandRouter.logger.info(curUri);
    var response;


    return response;
};



// Define a method to clear, add, and play an array of tracks
volavdspio.prototype.clearAddPlayTrack = function(track) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'volavdspio::clearAddPlayTrack');

	self.commandRouter.logger.info(JSON.stringify(track));

	return self.sendSpopCommand('uplay', [track.uri]);
};

volavdspio.prototype.seek = function (timepos) {
    this.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'volavdspio::seek to ' + timepos);

    return this.sendSpopCommand('seek '+timepos, []);
};

// Stop
volavdspio.prototype.stop = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'volavdspio::stop');


};

// Spop pause
volavdspio.prototype.pause = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'volavdspio::pause');


};

// Get state
volavdspio.prototype.getState = function() {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'volavdspio::getState');


};

//Parse state
volavdspio.prototype.parseState = function(sState) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'volavdspio::parseState');

	//Use this method to parse the state and eventually send it with the following function
};

// Announce updated State
volavdspio.prototype.pushState = function(state) {
	var self = this;
	self.commandRouter.pushConsoleMessage('[' + Date.now() + '] ' + 'volavdspio::pushState');

	return self.commandRouter.servicePushState(state, self.servicename);
};


volavdspio.prototype.explodeUri = function(uri) {
	var self = this;
	var defer=libQ.defer();

	// Mandatory: retrieve all info for a given URI

	return defer.promise;
};

volavdspio.prototype.getAlbumArt = function (data, path) {

	var artist, album;

	if (data != undefined && data.path != undefined) {
		path = data.path;
	}

	var web;

	if (data != undefined && data.artist != undefined) {
		artist = data.artist;
		if (data.album != undefined)
			album = data.album;
		else album = data.artist;

		web = '?web=' + nodetools.urlEncode(artist) + '/' + nodetools.urlEncode(album) + '/large'
	}

	var url = '/albumart';

	if (web != undefined)
		url = url + web;

	if (web != undefined && path != undefined)
		url = url + '&';
	else if (path != undefined)
		url = url + '?';

	if (path != undefined)
		url = url + 'path=' + nodetools.urlEncode(path);

	return url;
};





volavdspio.prototype.search = function (query) {
	var self=this;
	var defer=libQ.defer();

	// Mandatory, search. You can divide the search in sections using following functions

	return defer.promise;
};

volavdspio.prototype._searchArtists = function (results) {

};

volavdspio.prototype._searchAlbums = function (results) {

};

volavdspio.prototype._searchPlaylists = function (results) {


};

volavdspio.prototype._searchTracks = function (results) {

};

volavdspio.prototype.goto=function(data){
    var self=this
    var defer=libQ.defer()

// Handle go to artist and go to album function

     return defer.promise;
};

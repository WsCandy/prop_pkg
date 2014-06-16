'use strict';

var self = this;

var colour = require('cli-color'),
    notice = colour.yellow,
    error = colour.red;

var fs = require('fs');

var pp_move = require('./_move');

self.uninstall_handle = function(data) {

	var installed_package,
		install_path;

	for(var key in data) {

		installed_package = key;
		install_path = data[key];

	}

	var bower_json = require(install_path+'/../../.bower-cache/'+installed_package+'/bower.json');

	for (var key in bower_json.install) {

		var file = key;
		var dir = bower_json.install[key];

	}

}

self.remove_file = function(file, path) {



}
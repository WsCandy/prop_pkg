'use strict';

var self = this;

var colour = require('cli-color'),
    notice = colour.yellow,
    error = colour.red;

var fs = require('fs');

var pp_move = require('./_move');

var uninstall_count = 0;

self.uninstall_handle = function(data) {

	if(Object.keys(data).length) {

		var installed_package,
			install_path;

		for(var key in data) {

			installed_package = key;
			install_path = data[key];

		}

		var bower_json = require(install_path+'/../../.bower-cache/'+installed_package+'/bower.json');

		if(bower_json.install) {

			self.filesObj = bower_json.install;

			console.log(notice('\nInstall directories defined... Removing files from their directories!\n'));

			for (var key in bower_json.install) {

				var file = key;
				var dir = bower_json.install[key];

				self.remove_file(file, dir);

			}
			
		}

	} else {

		console.log(error('\nThis package already appears to have been removed... erm... yeah... :(\n'));

	}

}

self.remove_file = function(file, dir) {

	fs.unlink(dir + '/' + file, function(err) {

		if(err) throw err;

		console.log(notice(file + ' removed from ' + dir));

		uninstall_count++;
		
		if(uninstall_count == (typeof self.filesObj == 'object' ? Object.keys(self.filesObj).length : (typeof self.filesObj == 'string' ? 1 : self.filesObj.length))) pp_move.complete_log('uninstall');

	});

}
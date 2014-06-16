'use strict';

var self = this;

var colour = require('cli-color'),
    notice = colour.yellow,
    error = colour.red;

var fs = require('fs');
var pp_move = require('./_move');

var installed_package,
	install_path;

var uninstall_count = 0;

self.uninstall_handle = function(data) {

	if(Object.keys(data).length) {

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
			
		} else {

			if(bower_json.main) {

				self.filesObj = bower_json.main;

				console.log(notice('\nInstall paths not defined. Removing the "main" file from its directory... That\'s the plan anyway...\n'));

				if(typeof self.filesObj == 'string') {

	                self.remove_file(self.filesObj, pp_move.derive_install_path(pp_move.derive_file_type(self.filesObj)));
		                
	            } else {

	                for (var i = 0; i < self.filesObj.length; i++) {

	                    self.remove_file(self.filesObj[i], pp_move.derive_install_path(pp_move.derive_file_type(self.filesObj[i])));

	                }

	            }

			} else {

				console.log(notice('\nThe author hasn\'t specified a main file, the package has been removed from your FE Packages folder only'));

			}

		}

	} else {

		console.log(error('\nThis package already appears to have been removed... erm... yeah... :(\n'));

	}

}

self.remove_file = function(file, dir, silent) {

	file = file.split('/');
    file = file[file.length -1];

	fs.unlink(dir + '/' + file, function(err) {

		if(err) throw err;

		if(!silent) console.log(notice(file + ' removed from ' + dir));
		if(!silent) uninstall_count++;
		
		if(uninstall_count == (typeof self.filesObj == 'object' ? Object.keys(self.filesObj).length : (typeof self.filesObj == 'string' ? 1 : self.filesObj.length))) {

			uninstall_count++;
			if(!silent) pp_move.complete_log('uninstall');

			self.remove_file('bower.json', '.bower-cache/'+installed_package, true);
			fs.rmdir('.bower-cache/'+installed_package, function(err) {

				if(err) throw err;

			});

		}

	});

}
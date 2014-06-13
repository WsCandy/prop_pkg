'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');

var colour = require('cli-color'),
    notice = colour.yellow,
    error = colour.red;

var install_count = 0;

var self = this;


self.callback_handle = function(data) {

    // Set data to be global to this module

    self.data = data;    
    self.pkg_name = global.installed_package.split('#');
    self.results_info = self.data[self.pkg_name[0]];

    if(self.results_info) {
        
        self.install_dir = self.results_info['canonicalDir'];
        self.loop_install();
        
    } else {

        console.log(error('\nYeah... this package is already installed, keep trying though, don\'t give up!\n'));        

    }

}

self.complete_log = function() {

    var user_defined = self.results_info.pkgMeta,
        package_name = user_defined['name'],
        author = user_defined['authors'],
        version = self.results_info.endpoint['target'];
    
    console.log(notice('\n'+package_name + ' ' + version + ' by ' + (author == undefined ? 'No Author :(' : author) + ' sucessfully installed!! Lucky you.\n'));

}

self.loop_install = function() {

    self.filesObj = self.results_info.pkgMeta['install'];

    if(self.results_info.pkgMeta['install']) {

        console.log(notice('\nCopying Files...\n'));

        for(var key in self.filesObj) {

            self.create_dirs(key, self.filesObj[key]);

        }

    } else {

        var file = self.results_info.pkgMeta['main'];

        if(file) {
            
            console.log(notice('\nInstall paths not defined. Moving the "main" file into the correct directory... I hope...\n'));

            if(typeof file == 'string') {

                self.create_dirs(file, self.derive_install_path(self.derive_file_type(file)));
                
            } else {

                for (var i = 0; i < file.length; i++) {

                    self.create_dirs(file[i], self.derive_install_path(self.derive_file_type(file[i])));

                }

            }
            
        } else {

            console.log(notice('\nLooks like the author of '+self.results_info.pkgMeta['name']+' couldn\'t be bothered to set the main file...! You\'re going to have to move files manually, sorry about that!'));
            self.complete_log();

        }

    }

}

self.create_dirs = function(file, install_loc) {

    mkdirp(self.install_dir+'/../../'+install_loc, '0777', function(err) {

        if(err) throw err;

        self.move_file(file, install_loc);
        
    }); 

}

self.move_file = function(file, path) {

    var copy_file = fs.createReadStream(self.install_dir+'/'+file);
        copy_file.on('error', function(err) {

            if(err) throw err;

        });

    file = file.split('/');
    file = file[file.length -1];

    var copied_file = fs.createWriteStream(self.install_dir+'/../../'+path+'/'+file);
        copied_file.on('error', function(err){

             if(err) throw err;

        });

    copied_file.on('close', function() {

        console.log(notice(file + ' copied over to ' + path));
        install_count++;

        if(self.filesObj) {

            if(install_count == Object.keys(self.filesObj).length) self.complete_log();
            
        } else {

            self.complete_log();

        }

    });

    copy_file.pipe(copied_file);

}

self.derive_file_type = function(file) {

   var type = file.split('.');
   return type[type.length - 1];

}

self.derive_install_path = function(type) {

    return 'httpdocs/assets/'+type;

}
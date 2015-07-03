'use strict';

var self = this;

var colour = require('cli-color'),
    notice = colour.yellow,
    error = colour.red;

var fs = require('fs');
var mkdirp = require('mkdirp');

var pp_move = require('./_move'),
    pp_uninstall = require('../cu_mod/_uninstall');

var install_count = 0;


self.loop_install = function(answ) {

    self.answ = answ;

    if(self.answ.template === 'No templates detected!') {

         fs.rmdir(global.install_dir, function() {

            console.log(error('\nNo templates detected, aborting!\nCreate a template and Try again! \n'));

         });

         return;

    }

    if(global.results_info.pkgMeta['install']) {

        self.filesObj = global.results_info.pkgMeta['install'];
        console.log(notice('\nInstall directories defined! Copying Files...\n'));

        for(var key in self.filesObj) {

            self.create_dirs(key, self.filesObj[key]);

        }

    } else {

        if(global.results_info.pkgMeta['main']) {
            
            self.filesObj = global.results_info.pkgMeta['main'];
            var file = global.results_info.pkgMeta['main'];
            
            console.log(notice('\nInstall paths not defined. Moving the "main" file into the correct directory... I hope...\n'));

            if(typeof file == 'string') {

                self.create_dirs(file, pp_move.derive_install_path(pp_move.derive_file_type(file)));
                
            } else {

                for (var i = 0; i < file.length; i++) {

                    self.create_dirs(file[i], pp_move.derive_install_path(pp_move.derive_file_type(file[i])));

                }

            }
            
        } else {

            console.log(notice('\nLooks like the author of '+global.results_info.pkgMeta['name']+' couldn\'t be bothered to set the main file...! You\'re going to have to move files manually, sorry about that!'));

        }

    }

    self.create_dirs('bower.json', '.bower-cache/'+global.pkg_name, true);

}

self.create_dirs = function(file, install_loc, silent) {

    if(self.answ.template) {

        console.log(install_loc);

        var install_dest = global.install_dir+'/../../'+install_loc;

    } else {

        var install_dest = global.install_dir+'/../../'+install_loc;

    }

    mkdirp(install_dest, '0777', function(err) {

        if(err) throw err;

        self.move_file(file, install_loc, silent);
        
    }); 

}

self.move_file = function(file, path, silent) {

    var copy_file = fs.createReadStream(global.install_dir+'/'+file);
        copy_file.on('error', function(err) {

            if(err) throw err;

        });

    file = file.split('/');
    file = file[file.length -1];

    var copied_file = fs.createWriteStream(global.install_dir+'/../../'+path+'/'+file);
        copied_file.on('error', function(err){

             if(err) throw err;

        });

    copied_file.on('close', function() {

        if(!silent) console.log(notice(file + ' copied over to ' + path));        
        if(!silent) install_count++;

        if(self.filesObj) {

            if(install_count == (typeof self.filesObj == 'object' ? Object.keys(self.filesObj).length : (typeof self.filesObj == 'string' ? 1 : self.filesObj.length))) {

                if(!silent) pp_move.complete_log();
                
            }
            
        } else {

            pp_move.complete_log();

        }

    });

    copy_file.pipe(copied_file);

}
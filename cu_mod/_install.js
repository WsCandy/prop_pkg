'use strict';

var self = this;

var colour = require('cli-color'),
    notice = colour.yellow,
    error = colour.red;

var fs = require('fs');
var mkdirp = require('mkdirp');

var pp_move = require('./_move'),
    pp_uninstall = require('../cu_mod/_uninstall');

var rimraf = require('rimraf'),
    inq = require('inquirer');

var install_count = 0;


self.loop_install = function(answ) {

    self.answ = answ;

    if(self.answ.template === 'No templates detected!') {

         rimraf(global.install_dir, function() {

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

        var install = install_loc.split('/'),
            assetsPos;

        for(var i = 0; i < install.length -1; i++) {

            if(i <= assetsPos) continue;
            assetsPos = (install[i] == 'assets' ? null : i);

        }

        if(assetsPos) install.splice(assetsPos, 0, 'templates/'+self.answ.template);

        install_loc = install.join('/');
        
        if(assetsPos) self.filesObj[file] = install_loc;

        var install_dest = global.install_dir+'/../../'+install_loc;

    } else {

        var install_dest = global.install_dir+'/../../'+install_loc;

    }

    mkdirp.sync(install_dest, '0777'); 
    
    self.move_file(file, install_loc, silent);

}


self.move_file = function(file, path, silent) {

    var jsStream = fs.readFileSync(process.env.PWD+'/public/assets/js/src/main.js', {encoding: 'utf8'}),
        fileData,
        jsArray,
        sassArray;

    jsArray = jsStream.split('\n');

    var questions = [

         {

            type: 'input',
            name: 'func',
            message: 'What function name would you like?',
            default: 'install'
            
        }

    ];

    var isSrc = path.split('/');

    if(isSrc[isSrc.length -1] === 'src' && isSrc[isSrc.length -2] === 'js') {

        var init = fs.readFileSync(global.install_dir+'/'+file, {encoding: 'utf8'}),
            install_code = init.split('\n');

        var user_defined = global.results_info.pkgMeta,
            package_name = user_defined['name'];

        jsArray[jsArray.length - 3] = jsArray[jsArray.length - 3] + ',\n\n\t' + package_name + '__ready : function() { \n\n\t\t'+install_code.join('\n\t\t')+'\n\n\t}';
        fileData = jsArray.join('\n');

        fs.writeFileSync(process.env.PWD+'/public/assets/js/src/main.js', fileData, {encoding: 'utf8', flags: 'w'});

         console.log(notice(package_name + '__ready Written into main.js - Line: ' + (jsArray.length)));

        install_count++;
        self.trackInstall(silent);


    } else if(isSrc[isSrc.length -2] === 'sass') { 

        var sassStream = fs.readFileSync(process.env.PWD+'/public/assets/sass/main.scss', {encoding: 'utf8'});
        
        sassArray = sassStream.split('\n')

        var insertLine = (sassArray.length -1),
            filename = file.split('/')

        for(var i = 0; i < sassArray.length -1; i++) {

            if(sassArray[i].indexOf(isSrc[isSrc.length -1]) > 0) {

                insertLine = i;
                
            }

        }

        filename = filename[filename.length -1].split('.');
        sassArray.splice((insertLine + 1), 0, '@import "'+isSrc[isSrc.length - 1]+'/' + filename[filename.length -2] + '"');
        
        fileData = sassArray.join('\n');

        fs.writeFileSync(process.env.PWD+'/public/assets/sass/main.scss', fileData, {encoding: 'utf8', flags: 'w'});
        self.fileCopy(file, path, silent);
        console.log(notice('@import "'+isSrc[isSrc.length - 1]+'/' + filename[filename.length -2] + '" Written into main.scss - Line: ' + (insertLine + 2)));


    } else {

        self.fileCopy(file, path, silent);

    }

}

self.fileCopy = function(file, path, silent, copy) {

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
        
        self.trackInstall(silent);

        if(file == 'bower.json') {

            fs.writeFile('.bower-cache/'+global.pkg_name+'/bower.json', JSON.stringify(global.results_info.pkgMeta));

        }

    });

    copy_file.pipe(copied_file);


}

self.trackInstall = function(silent) {

    if(self.filesObj) {

        if(install_count == (typeof self.filesObj == 'object' ? Object.keys(self.filesObj).length : (typeof self.filesObj == 'string' ? 1 : self.filesObj.length))) {

            if(!silent) pp_move.complete_log();
            
        }
        
    } else {

        pp_move.complete_log();

    }

}
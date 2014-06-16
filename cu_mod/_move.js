'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');

var pp_install = require('../cu_mod/_install');

var colour = require('cli-color'),
    notice = colour.yellow,
    error = colour.red;

var self = this;


self.callback_handle = function(data, command) {

    global.data = data;    
    global.pkg_name = global.installed_package.split('#');
    global.results_info = global.data[global.pkg_name[0]];

    if(global.results_info && command == 'install') {
    
        global.install_dir = global.results_info['canonicalDir'];
        pp_install.loop_install();
        
    } else {

        console.log(error('\nYeah... this package is already installed, keep trying though, don\'t give up!\n'));        

    }

}

self.complete_log = function() {

    var user_defined = global.results_info.pkgMeta,
        package_name = user_defined['name'],
        author = user_defined['authors'],
        version = global.results_info.endpoint['target'];
    
    console.log(notice('\n'+package_name + ' ' + version + ' by ' + (author == undefined ? 'No Author :(' : author) + ' sucessfully installed!! Lucky you.\n'));

}

self.derive_file_type = function(file) {

   var type = file.split('.');
   return type[type.length - 1];

}

self.derive_install_path = function(type) {

    return 'httpdocs/assets/'+type;

}
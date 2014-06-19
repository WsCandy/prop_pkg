'use strict';

var pp_install = require('../cu_mod/_install'),
    pp_uninstall = require('../cu_mod/_uninstall');

var colour = require('cli-color'),
    notice = colour.yellow,
    error = colour.red;

var inq = require('inquirer'),
    fs = require('fs');

var self = this;

self.callback_handle = function(data, command) {

    global.data = data;    
    global.pkg_name = global.installed_package.split('#');
    global.results_info = global.data[global.pkg_name[0]];

    if(global.results_info && command == 'install') {
    
        global.install_dir = global.results_info['canonicalDir'];

        self.askQuestions(pp_install.loop_install);
        
    } else if(command == 'uninstall'){

        pp_uninstall.uninstall_handle(data);

    } else {
        
        console.log(error('\nYeah... this package is already installed, keep trying though, don\'t give up!\n'));        

    }

}

self.complete_log = function(message) {

    if(message == 'uninstall') {

        console.log(notice('\nPackage uninstalled successfully! Wow, amazing.\n'));

    } else {

        var user_defined = global.results_info.pkgMeta,
            package_name = user_defined['name'],
            author = user_defined['authors'],
            version = global.results_info.endpoint['target'];
        
        console.log(notice('\n'+package_name + ' ' + version + ' by ' + (author == undefined ? 'No Author :(' : author) + ' sucessfully installed!! Lucky you.\n'));
        
    }

}

self.getPSdirs = function() {

    var templates = fs.readdirSync('httpdocs/assets/templates');

    return templates;

}

self.askQuestions = function(callback) {

    var questions = [

        {

            type: 'confirm',
            name: 'prop_shop',
            message: 'Is this a propshop site?',
            default: false
            
        },

        {

            type: 'list',
            name: 'template',
            message: 'Which template are you working out of?',
            default: 'default',
            choices: self.getPSdirs(),
            when: function(answ) {

                return answ.prop_shop != false;

            }

        }

    ];

    inq.prompt(questions, function(answ) {

        callback(answ);

    });

}

self.derive_file_type = function(file) {

   var type = file.split('.');
   return type[type.length - 1];

}

self.derive_install_path = function(type) {

    return 'httpdocs/assets/'+type;

}
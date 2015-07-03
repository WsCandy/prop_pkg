'use strict';

var pp_install = require('../cu_mod/_install'),
    pp_uninstall = require('../cu_mod/_uninstall');

var colour = require('cli-color'),
    notice = colour.yellow,
    error = colour.red;

var inq = require('inquirer'),
    fs = require('fs'),
    events = require('events'),
    eventEmitter = new events.EventEmitter();

var self = this;

self.callback_handle = function(data, command) {

    global.data = data;
    global.pkg_name = global.installed_package.split('#');
    global.results_info = global.data[global.pkg_name[0]];

    if(global.results_info && command == 'install') {
    
        global.install_dir = global.results_info['canonicalDir'];

        eventEmitter.on('success', function(templates) {

            self.askQuestions(pp_install.loop_install, templates);
            
        });

        self.getPSdirs();
        
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
    
    var templates = [];

    fs.readdir('public/assets/templates', function(err, files) {

        if(err || files.length === 0) {

            templates.push('No templates detected!');
            
        } else {

            for(var i = 0; i < files.length; i++) {

                if(fs.statSync('public/assets/templates/'+files[i]).isDirectory() === true) {

                    templates.push(files[i]);

                }

            }

        }

        eventEmitter.emit('success', templates);

    });

}

self.askQuestions = function(callback, templates) {

    var questions = [

        {

            type: 'confirm',
            name: 'templates',
            message: 'Does this site use templates?',
            default: false
            
        },

        {

            type: 'list',
            name: 'template',
            message: 'Which template are you working out of?',
            default: 'No templates detected!',
            choices: templates,
            when: function(answ) {

                return answ.templates != false;

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

    return 'public/assets/'+type;

}
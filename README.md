Propeller Package Management
===

1.1.1 Update
---

Uninstall methods have now been added to the scripts! Not only will the script remove it from your FE Packages folder it will also remove the files moved around at installation.

#####Release History

https://github.com/WsCandy/prop_pkg/releases

Correct Usage:
---

When working with prop_pkg there are a few things to take into consideration.

* Always run it from the root of your version, as the install paths are relative to this location. It will still function if you run it elsewhere but this may cause issues. This may be addressed in future versions.
* Deleting packages manually is fine however you may get errors when you run ppm uninstall package_name
* Moving files out of their install directories will cause errors when trying to uninstall, this is due to being unable to locate the file during uninstallation.
* Please prefix your custom packages with "propcom", for example "propcom-zRS". This will make searching for our packages on the Bower registry a lot easier.
* Dependencies will be downloaded but won't be installed in their appropriate locations, this may be looked at in future, depends on feedback.

Setting up your repo:
---

To get your repositories working with properly with prop_pkg you have to create a bower.json file. This file contains all the information associated with your repository including install directories, your name package name etc!

An example can be found here: https://github.com/WsCandy/zRSv2/blob/master/bower.json

In order for the installation scripts to run you need to define install paths for the files required by your package. This is done by adding an "install" object to your bower.json e.g.

	"install" : {

	        "zRS.js" : "httpdocs/assets/js/lib",
	        "scripts.js" : "httpdocs/assets/js/src"

	}

The file name is the key and the value is the install path, there is no limit to the number of files you can put in this object so include all the necessary files.

The ignore object is a list of files / directories that WILL NOT be downloaded when the scripts are ran, it's useful to fill all this to prevent downloading the entire repo. Please do not ignore the bower.json file as it's used for the uninstall script.

	"ignore" : [

	        "/sass/",
	        "/css/",
	        "/img/",
	        "/index.html"

	]

Once your bower.json has been set up you'll need to publish your package to the bower registry, to do this simply run

	bower register <my-package-name> <git-endpoint>

from your main git repo directory. A bower.json MUST be created before you can run this.

Here is a working example:

	bower register propcom-zRS https://github.com/WsCandy/zRSv2.git

Magic, I think that's all of it.

Commands:
---

####Basic

	ppm

This will return a list of commands that you can use.

####Search

	ppm search propcom

This will search for the term 'propcom' and will return a list of available packages.

####Information

	ppm info propcom-zRS

This command will return information such as available versions for the specified package.

####Installation

	ppm install propcom-zRS

This will install the latest release version of the package, in this instance it's 2.6.7.

	ppm install propcom-zRS#2.6.6

This will install version tagged 2.6.6!

	ppm install propcom-zRS#master

This will install the master branch.

####Uninstallation

	ppm uninstall propcom-zRS

This will uninstall the package from your FE Packages folder and from their original install paths.

Server Installation:
---

It's simple to install just run the following in your command line/terminal:

	sudo npm install -g prop_pkg

If you're pulling down the repo to work on navigate your way to the directory and run:

	npm install

to get all the required dependencies.
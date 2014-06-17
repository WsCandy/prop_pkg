Propeller Package Management
===

1.1.1 Update
---

Uninstall methods have now been added to the scripts! Not only will the script remove it from your FE Packages folder it will also remove the files moved around at installation.

#####Release History

https://github.com/WsCandy/prop_pkg/releases

Installation:
---

It's simple to install just run the following in your command line/terminal:

	sudo npm install -g prop_pkg

If you're pulling down the repo to work on navigate your way to the directory and run:

	npm install

to get all the required dependencies.

Commands:
---

####Basic

	ppm

This will return a list of commands that you can use.

####Search

	ppm search propcom

This will search for the term 'propcom' and will return a list of available packages.

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
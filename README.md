# Intel Service Assurance Manager Front-End Web Application

## Set up front-end development environment
0. Run sudo ~/ipm-install.sh (in your LXE container's home directory)
1. If necessary (although Node.js and NPM should already be installed by ipm-install.sh), install Node and NPM by using the installation instructions at https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
2. Install front-end development dependencies
   A. Run ./dev-install.sh OR ./dev-install.sh -s samba (if you'd also like to set up a SAMBA share for accessing your home directory from Windows) without sudo
    -OR-
   B. Run the commands individually
      i.  Run "npm install -g grunt-cli bower" to put grunt and bower in your system path
      ii. Run "npm install" in this directory to install other dependencies like grunt plugins (which are defined in package.json)

## Development
1. Edit source files in scripts, styles, etc.
2. You may use Bower as a package manager for client-side libraries (defined in components.json)
2. Run "grunt server" to start up a local development server for testing, accessible on port 8000
3. Run "grunt build" to compile files into ../public

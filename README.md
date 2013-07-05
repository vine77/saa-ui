# Intel Service Assurance Manager Front-End Web Application

## Set up front-end development environment
1. Install Node.js and NPM by using the installation instructions at https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
2. Run "npm install" in this directory to install other dependencies like grunt and grunt plugins (defined in package.json)
3. You may also need to run "npm install -g grunt-cli" to put grunt in your system path

## Development
1. Edit source files in scripts, styles, etc.
2. You may use Bower as a package manager for client-side libraries (defined in components.json)
2. Run "grunt server" to start up a local development server for testing
3. Run "grunt build" to compile files into ../../public

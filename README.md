# Intel Service Assurance Manager Front-End Web Application

Note: Directories specified are relative to this location: overlays/ipm/rootfs/srv/www/source

## Set up front-end development environment
1. Run "./dev-install.sh" OR "./dev-install.sh -s samba" if you'd also like to set up a SAMBA share for accessing your home directory from Windows (without sudo). (Note: this also turns /srv/www into a symbolic link that points to the equivalent location in the repository, so that files edited in the repository will show up on the server.)
  -OR-
2. Run the minimum necessary commands individually
    a.  Run "npm install -g grunt-cli bower" to put grunt and bower in your system path
    b. Run "npm install" in this directory to install other dependencies like grunt plugins (which defined in package.json)

## Development
1. Source code: Edit source files in ./scripts, ./styles, etc.
2. Package management: Use Bower for package management of client-side libraries (which are defined in bower.json and installed to ./components) - See http://bower.io
2. Preview server: Run "grunt server" to start up a local development server for testing, accessible on port 8000, e.g. http://localhost:8000. Note: the web application run with grunt server will serve the static JSON files in ./api rather than use a live API. Developers can point to a different API via http://localhost:8000/#/settings/dev
3. Build system: Run "grunt build" to compile files into ../public as specified by the tasks in ./Gruntfile.js - See http://gruntjs.com

## Source control
* Check in grunt builds as separate git commits
* Only check in a grunt build if performed on the HEAD of the current branch (i.e. don't cherry-pick or otherwise commit a UI build from anywhere else). We should be able to assume that the UI Build always reflects the most recent commits on that branch.

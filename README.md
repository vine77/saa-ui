# SAA UI Development

This README outlines the details of collaborating on this Ember application.

## Prerequisites

* Install dependencies via `npm install -g grunt-cli bower` or full dev environment via `./dev-install.sh`

## Installation

* `npm install`
* `bower install`

## Development

1. Source code: Edit source files in ./scripts, ./styles, etc.
2. Package management: Use Bower for package management of client-side libraries (which are defined in bower.json and installed to ./components) - See http://bower.io

## Running

* `make server`
* Visit your app at http://localhost:8000

## Building

* `make`

## Notes on source control
* Check in grunt builds as separate git commits
* Only check in a grunt build if performed on the HEAD of the current branch (i.e. don't cherry-pick or otherwise commit a UI build from anywhere else). We should be able to assume that the UI Build always reflects the most recent commits on that branch.

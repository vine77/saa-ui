# SAA UI Development

This README outlines the details of collaborating on this Ember application.

## Prerequisites

* Install Node.js/NPM
* Install dependencies via `npm install -g ember-cli bower` or `./scripts/install.sh` if you are behind the Intel firewall

## Installation

* `npm install`
* `bower install`

## Running

* `make server`
* Visit your app at http://localhost:4200

## Building

* `make`

## Notes on development

For more information on using ember-cli, visit [http://ember-cli.com](http://ember-cli.com).

## Notes on source control

* Check in grunt builds as separate git commits
* Only check in a grunt build if performed on the HEAD of the current branch (i.e. don't cherry-pick or otherwise commit a UI build from anywhere else). We should be able to assume that the UI Build always reflects the most recent commits on that branch.

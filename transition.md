# Transition TODO

* [X] Use export with renamed files
* [X] Port utils/old/mappings.js
* [X] Change instances of App.X mappings to use modules
* [X] NOT_APPLICABLE
* [X] Change instances of App.X convertions to use modules
* [X] Port utils/old/helpers.js
* [X] Change instances of App.Y helpers to use modules
* [X] Port utils/old/mixins.js
* [X] App.mtWilson
* [X] Move instances of NOT_APPLICABLE to better levels of abstraction
* [X] Change $ to Ember.$
* [X] Change {{#view App.ExampleView}} to {{#view "example"}}
* [X] Convert Binding to Ember.computed.alias
* [X] Convert template exampleBinding="something" to example=something
* [ ] Change other instances of App.Z to use modules
    * [X] App.application
    * [X] App.nova
    * [X] App.openrc
    * [ ] App.quantum
    * [ ] App.keystone
    * [ ] App.network
    * [ ] App.graphs
    * [ ] App.selectTab
    * [ ] App.route
    * [ ] App.store
* [ ] Remove utils/old
* [ ] If we still need to use global (e.g. moment), add those to the predef section of .jshintrc and set value in initializers

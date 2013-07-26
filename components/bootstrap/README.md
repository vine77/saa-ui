<a href="http://jasny.github.com/bootstrap">
  <img src="http://jasny.github.com/bootstrap/assets/img/bootstrap-docs-readme.png" width="100px">
</a>
# [Jasny Bootstrap v2.3.0-j4](http://jasny.github.com/bootstrap) [![Build Status](https://travis-ci.org/jasny/bootstrap.png?branch=master)](https://travis-ci.org/jasny/bootstrap)

Bootstrap is a sleek, intuitive, and powerful front-end framework for faster and easier web development, created and maintained by [Mark Otto](http://twitter.com/mdo) and [Jacob Thornton](http://twitter.com/fat).

This version is extended by [Arnold Daniels](http://twitter.com/ArnoldDaniels) of [Jasny](http://www.jasny.net/) and contains a number of extra features.

To get started, checkout http://jasny.github.com/bootstrap!



## Quick start

Three quick start options are available:

* [Download the latest release](https://github.com/jasny/bootstrap/zipball/master).
* Clone the repo: `git clone git://github.com/jasny/bootstrap.git`.
* Install with Twitter's [Bower](http://twitter.github.com/bower): `bower install jasny/bootstrap`.



## Versioning

For transparency and insight into our release cycle, and for striving to maintain backward compatibility, Bootstrap will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>-j<jasny version>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit [http://semver.org/](http://semver.org/).

Additionally the version for the Jasny extensions will simply be incremented with each release and is prefixed with a 'j'.


## Bug tracker

Have a bug or a feature request? [Please open a new issue](https://github.com/jasny/bootstrap/issues). Before opening any issue, please search for existing issues and read the [Issue Guidelines](https://github.com/necolas/issue-guidelines), written by [Nicolas Gallagher](https://github.com/necolas/).



## Community


We have included a makefile with convenience methods for working with the Bootstrap library.

+ **dependencies**
Our makefile depends on you having recess, connect, uglify.js, and jshint installed. To install, just run the following command in npm:

```
$ npm install recess connect uglify-js jshint -g
```

+ **build** - `make`
Runs the recess compiler to rebuild the `/less` files and compiles the docs pages. Requires recess and uglify-js. <a href="http://jasny.github.com/bootstrap/extend.html#compiling">Read more in our docs &raquo;</a>

+ **test** - `make test`
Runs jshint and qunit tests headlessly in [phantomjs](http://code.google.com/p/phantomjs/) (used for ci). Depends on having phantomjs installed.

+ **watch** - `make watch`
This is a convenience method for watching just Less files and automatically building them whenever you save. Requires the Watchr gem.



## Contributing

Please submit all pull requests against *-wip branches. If your pull request contains JavaScript patches or features, you must include relevant unit tests. All HTML and CSS should conform to the [Code Guide](http://github.com/mdo/code-guide), maintained by [Mark Otto](http://github.com/mdo).

Thanks!



## Authors

**Mark Otto**

+ [http://twitter.com/mdo](http://twitter.com/mdo)
+ [http://github.com/mdo](http://github.com/mdo)

**Jacob Thornton**

+ [http://twitter.com/fat](http://twitter.com/fat)
+ [http://github.com/fat](http://github.com/fat)

**Arnold Daniels**

+ [http://twitter.com/ArnoldDaniels](http://twitter.com/ArnoldDaniels)
+ [http://github.com/jasny](http://github.com/jasny)
+ [http://www.jasny.net](http://www.jasny.net/)



## Copyright and license

Copyright 2012 Twitter, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

  [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

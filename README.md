![hi_score][_0A]
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

*A modern full-lifecycle starter project for SPAs*

---
## Overview
This SPA starter project provides best-in-class assets, libraries, documentation, and tools to help guide best practice. But please do swap assets and libraries as required. [That's the point][_01].

---
## Quick start
```
  $ cd hi_score; export PATH=`pwd`/bin:$PATH;
  $ xhi build && google-chrome build/latest/dist/ex0*.html

```
The `xhi build` command will install vendor assets; setup and patch files for development; configure a development HTTP server; test code with JSLint; check TODO items; run all regression test suites; calculate and report test coverage; minimize, obsfucate, and package a distribution with unique ID, and more. Yes, we know the examples are lame. We promise to make them more exciting in the future.

---
## Key benefits
- Automated full-lifecycle best practice with the `xhi` tool
- Installation and management of currated libs and assets
- Fully managed of vendor assets including SCMS controlled patching
- Type safety using [type-casting][_05]
- Battle-tested `xhi` libraries with 98% coverage of core utilities
- Integrated development server using HTTPS and HTTP2
- Consistent JS and Bash code style [see Code standard][_03]
- Integrated with GIT and NPM lifecycles
- TDD with drop directory and code coverage reports
- One-touch build with deployment-ready distributions
- Example applications
- Placeholders for future lifecycle phase marked WIP.

---
## The xhi tool
The `xhi` tool automates almost every conceivable stage of the SPA development process using researched best practice. The configuration is stored in the NPM `package.json` file and is used to support all [NPM lifecycle scripts][_38]. The `xhi` will run the multiple number of stages to attain a goal (See [below][#run-lifecycle-stages]) and will abort with guidance instructions if any prerequisite stage cannot be met.

The full-lifecycle stages supported by `xhi` are shown below. Those marked 1.4.x are placeholder which will be addressed in the next major release.

```
  $ xhi help all
    xhi>  START Stage 00 help
    xhi>  00 help        : Help on 'xhi' tool, use -v for verbose
    xhi>  01 install     : Download and install npm modules
    xhi>  02 setup       : Patch and distribute vendor npm assets
    xhi>  03 design      : Show architecture docs
    xhi>  04 dev_pull    : Download and merge SCMS assets (git pull)
    xhi>  05 dev_upgrade : Upgrade packages to latest
    xhi>  06 dev_start   : Start local HTTP server
    xhi>  07 dev_test    : Run regression tests
    xhi>  08 dev_lint    : Lint changed code
    xhi>  09 dev_cover   : Create coverage report
    xhi>  10 dev_commit  : Commit changes with git
    xhi>  11 build       : Build a distribution
    xhi>  12 publish     : Upload to publishers
    xhi>  13 dev_restart : Cycle local HTTP server
    xhi>  14 dev_stop    : Stop local HTTP server
    xhi>  15 deploy      : Upload distribution        1.4.x
    xhi>  16 prod_start  : Start production server(s) 1.4.x
    xhi>  17 prod_restart: Cycle production server(s) 1.4.x
    xhi>  18 prod_stop   : Stop production server(s)  1.4.x
    xhi>  19 fetch_info  : Fetch feedback             1.4.x
    xhi>  20 uninstall   : Remove xhi                 1.4.x
    xhi>  END Stage 00 help
```

### Get help
The `xhi` tool help is detailed and extensive. We have deleted many sections of this document because the information is now directly integrated  One can see detailed help on a stage or range of stages by including a `-v` flag as shown below.

```
  $ xhi help dev_lint -v
    xhi>  START Stage 00 help
    xhi>  08 dev_lint:
    xhi>    Check lint quality of changed JS code.
    xhi>    Files in 'vendor' directors are ignored.
    xhi>    Four tests are performed on each file:
    xhi>      1. Fail if tabs characters or trailing space.
    xhi>      2. Fail if 'use strict'; is not found.
    xhi>      3. Fail if 'jslint --config config/jslint.conf <file>'
    xhi>         does not pass.
    xhi>      4. List TODO items for developer review.
    xhi>         Fail if developer does not approve.
    xhi>    NPM SCRIPTS      : none.
    xhi>    SUCCESS CRITERIA : All tests complete without error
    xhi>  END   Stage 00 help
```

### Run lifecycle stages
A typical workflow is shown below.

```
  # Get list of stages
  $ xhi help all

  # Run desired stage-range
  $ xhi dev_cover,build
```

The `xhi` tool takes a `<stage-range>` argument. Stages that are provided out-of-order are sorted before running. Example use is shown below.

```
  # Run a single stage
  $ xhi install

  # Run all stages between 'install' and 'dev_commit' inclusive
  $ xhi install-dev_commit

  # Run individual stages
  $ xhi update,dev_cover

  # Run a range using stage numbers
  $ xhi 0-5

  # Get help on ranges
  $ xhi help install -v
  $ xhi help install-dev_commit
  $ xhi update,dev_cover
  $ xhi help 0-5
```

The `xhi` tool will often run more than one stage even when we specify just one. That is because many stage require prequisite as discussed in the following section.

### Prerequisite resolution
The `xhi` has a sophisticated prerequisite resolver that ensures required stages are run only if required.

#### Goal prerequisites
Goal prerequisites are stages that are always run before before the target stage. For example, if we run `xhi dev_commit` the `dev_lint`, and `dev_test` stages will be run first to ensure the code quality is acceptable. If either prerequisite fails, `xhi` exits immediately (with an exit code of 1) and the target stage is not attempted. Goal prequesites are configuired in `package.json.xhi_commandTable`.

#### Environment prequisites
These are stages that must be successfuly completed in the development environment. For example, if we run `xhi dev_commit` but have not run `xhi install`, the `install` stage will be run before the `dev_commit` stage. The success or failure of each stage is saved in the state file (`lib/xhi_state.json`) and the next stage is run. If the `install` stage succeeds it will not be included in future prerequisite calculations.

Environment prerequisites may be invalidated. For example, if `xhi install` or `xhi upgrade` fail, the tool will mark the `install` stage as failed and this will be attempted again in the next `xhi` invocation that require it as a prerequisite.

Explicitly requested stages will run again regardless of their last success statuses. For example, `xhi dev_lint` may or may not run the `install` stage, but `xhi install,dev_lint` will *always* run the `install` stage because it is explicitly listed. `xhi help-dev_lint` will also run `install` since it is explicitly within the range provided.  We can reset the status by removing the `stage_status_map` from the `lib/xhi_state.json` file.

### Exit status
If all the stages of a range are successful an exit status of `0` is provided. If any stage fails  processing of the range stops and an exit status of `1` is provided. In Bash, the return status is available in the `$?` environment variable.

---
## Code Style
We use the code style presented in [Single Page Web Applications - JavaScript end-to-end][_00] (see reviews on [Amazon][_02]). The [quick reference][_03] and the [full code standard][_04] are available online and are included in the `docs` directory.

---
## Browser compatibility
Our baseline compatibility is IE9+. Those supporting IE 8 have our sympathy.

---
## Deployment platform
The server component of **hi\_score** is designed to run on industry-standard hardware, cloud instances like Amazon EC2, and containers. Our server platform is Ubuntu 16.04 LTS. Later version of Ubuntu and other distributions should work well.

---
## Development platform
### Ubuntu 16.04, 16.10, 17.04
Everything should just work on recent Ubuntu and derivatives like Mint or Kubuntu. The steps to install all required libraries are shown below.

```
  # Install development libs
  sudo apt-get install build-essential openssh-server git pandoc \
    libfile-slurp-perl liblist-moreutils-perl libgetopt-mixed-perl

  # Install nodejs
  curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
  sudo apt-get install -y nodejs

  # Install mongodb
  sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 \
    --recv 0C49F3730359A14518585931BC711F9BA15703C6
  echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" \
    | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
  sudo apt-get update && sudo apt-get install -y mongodb-org
```

### Other Linux
Other Linux distributions should generally work as long as the same libraries can be installed with Ubuntu. It works fine on current versions of CentOS. Development libraries should be installed as shown below.

```
  $ yum install gcc gcc-c++ make openssl-devel
```

See [this guide][_06] for NodeJS package installation on other Linux distros. Here is a more [generic guide][_07] for Kubuntu and Ubuntu.

### Virtual Machine
Use AWS or a Virtual Box image using Ubuntu 16.04 Server using the the same steps above. This is the recommended approach for MacOS or Windows users.

### Mac
We have not been able to test developing natively on a Mac but it should be possible. At the very least one would need Bash 4+, [GNU Core utilities][_08], NodeJS, Git, PanDoc, and SSH.

### Windows
We recommend using a virtual machine as detailed above.

---
## Namespaces
Namespaces enable us to provide a suite of web apps that share a great deal of code but have instances and data cleanly isolated. Namespacing across JS and CSS can help one trace behaviors to the controlling code faster and with greater accuracy. We can open them in google-chrome (`xhi install && google-chrome ex*.html`) to see this in practice.

When we view Example 1 (`ex01.html`) we can open the browser development tools (press `<shift>-<ctrl>-i` or `<shift>-<cmd>-i` on a Mac), type `ex01` into the JavaScript console and press `<return>` to inspect that value. We can see that thisw single variable that contains our entire application. When we enter `ex02` we see that it is `undefined`. When we visit the Example 2 (`ex02.html`) instead we can see that `ex01` is `undefined` and `ex02` contains our app code using a similar process.

We also namespace our CSS classes to avoid collisions. When we inspect the HTML of the Example 1 app we can see that nearly all classes start with an `ex01-` prefix. When we inspect Example 2 tab we find the prefix is `ex02-`. As with the JavaScript namespacing, the prefixes are hierarchical. For example, the `ex02-_lb_` class was generated for use by the `ex02-_lb_` module.

---
## Vendor assets
The `xhi setup` stage patches and deploys vendor assets using the `xhi_02_SetupMatrix` configuration found in the `package.json` file.  This field is correlated with the with the `devDependencies` map to ensure assets are properly label, patched, distributed, and ignored by GIT.

Assets are copied to their destination directory with their version number appended to their names. The `.gitignore` file instructs `git` to ignore all these files as their development management is external to our project. **Everytime `xhi setup` is run the vendor directories are deleted and recreated**.

### Executable assets
Vendor executables are copied to the `bin/vendor` directory.

### Font assets
Vendor font files are copied to the `font/vendor` directory. These fonts are currently installed:

- [Font Awesome][_30]: Icon fonts
- [Open Sans][_31]: OSS Font face

### Image assets
Vendor images are be copied to the `img/vendor` directory.

### JavaScript assets
#### Client JS libraries
Client libraries are copied to the `js/vendor` directory. This makes them available to the web server. The following libraries are installed:

- [jQuery][_10]: DOM manipulation
- [PowerCSS][_11]: JS-powered CSS
- [jQuery Plugin: event.dragscroll][_12]: Inertia scroll
- [jQuery Plugin: event.gevent][_13]: Global events
- [jQuery Plugin: event.ue][_14]: Touch and desktop gestures
- [jQuery Plugin: scrolli][_15]: Scroll indicators
- [jQuery Plugin: urianchor][_16]: SPA routing
- [SprintF][_32]: Sprintf library
- [TaffyDB][_17]: Client data management

#### Node JS libraries
NodeJS libraries are **not** copied to a `vendor` directory. We may changes this if we decide to create a server distribution. The following libraries are installed:

- [clusterjs][_34]: Server multiplexer
- [express][_36]: Minimalist Sinatra HTTP server
- [mongodb][_34]: Official mongodb node client
- [mysql2][_35]: Faster mysql interface
- [websocket][_37]: Websockets interface

#### Development JS libraries
Developent libraries are used for testing a building code. They **are** not copied to a `vendor` directory and probably never will be as they are for development, not deployment. The following libraries are installed:

- [coveralls][_18]: Code coverage reporting
- [istanbul][_19]: Code coverage
- [jsdom][_20]: DOM mock for testing
- [jslint][_21]: Linting for xhi, commit hook
- [nodeunit][_22]: Unit testing
- [node-inspector][_23]: Debugging
- [uglifycss][_24]: CSS minification
- [uglifyjs][_25]: JS minitifcation
- buildify: Build script

### Styling assets
Vendor CSS libraries are copied to the `css/vendor` directory. We copy the Font Awesome CSS files to this directory:

- [Font Awesome][_30]: Icon fonts

### Patches
The `xhi_02_SetupMatrix.patch_matrix` directs patch application.

The `xhi setup` stage applies patches to vendor assets. The configuration for patches are in `package.json` in the `xhiPatchMatrix` map. The patches are stored in the `patch` directory.

The patches mechanism allows us to use great tools tweaked for our needs while maintaining the upstream source. For example, we patch `uglify-js` to support object property name compression and shuffling by `superpack`.

---
## Build
Use `xhi build` or `xhi make` or `xhi 11` (where 11 is the stage number) to build a distribution. The build script concatenates, compresses, and obsufucates JavaScript and CSS. It copies only the required assets into the the distribution directory (`build/<build_id>/dist`). The result loads faster, runs faster, and typically consumes less than 5% of the disk space of the development code. We can inspect the files and disk usage as follows:

```
  $ ## Show disk usage of all development files
  $ cd hi_score && export PATH=`pwd`/bin:$PATH;
  $ du -sh .
    160M

  $ ## Get disk usage of all distribution files
  $ xhi build && cd build/latest && du -sh .
    2.1M
```

The `xhi make` stage uses the `buildify` to make a distribution. This script in turn uses `superpack` to analyze all symbols (variable names, object properties, and labels) and replaces them with shortened and shuffled keys. The shortest keys are used for the most frequently found symbols. `superpack` reports the key-to-symbol mapping and the frequency of use which makes further optimizations by pruning code easier (see `build/<build-number>/stage/<name>.diag` for mapping and key use). Projects with many object properities can be compressed an additional 50% using `superpack` and it can make reverse-engineering of the compressed code much harder.

It is typical to see distributions require only 2-10% the storage of a development environment.There are substantial benefits beyond storage reduction. In particular, security is greatly improved because only a tiny, currated, obsfucated portion of your code is published and sensitive data such as SCMS metadata, documentation, lookup-maps, and development assets are omitted for use to publish elsewhere at our discretion. The distribution-ready application also reduces the dozens of HTTP calls to just a few. This can reduce load time significantly as illustrated below.

| Attribute   | Original (%)     | Minified (%)     | Superpack (%)    |
|-------------|-----------------:|-----------------:|-----------------:|
| Size        | 601,027 (100.0%) | 215,400 ( 35.8%) | 162,494 ( 27.1%) |
| Gzipped     | 151,716 ( 25.2%) |  62,895 ( 10.4%) |  57,275 ( 09.5%) |

| Attribute   | Original         | Minified (%)     | Superpack (%)    |
|-------------|-----------------:|-----------------:|-----------------:|
| HTTP reqs   |      27 (100.0%) |       4 ( 15.4%) |       4 ( 15.4%) |
| Local ms    |     231 (100.0%) |     166 ( 71.2%) |     144 ( 62.3%) |
| Deploy Size |           121 MB |    8 MB (  6.6%) |    8 MB (  6.5%) |

The load time measurements were made using a local HTTP server which is almost certainly a best-case scenario. We hope to add results for a remote server soon.

## Contribute
Any improvements or suggestions are welcome through the [issues tracker][_29]. Pull requests are especially appreciated.

## Release Notes
### Copyright (c)
2016, 2017 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

### License
MIT

### Version 0.0.x
- (x) Initial preparation

### Version 0.1.x
- (x) Library updates

### Version 0.2.x
- (x) Regression and integration testing
- (x) Rudimentary sample app

### Version 0.3.x
- (x) Add code coverage
- (x) Replace `getDeepMapVal` and `setDeepMapVal` with more powerful and tested `getStructData` and `setStructData`
- (x) Updates to `xhi/01.util.js`

### Version 0.4.x
- (x) Replace `jscoverage` with much more complete and recent `istanbul`
- (x) Added `cast` routines and detail their use
- (x) Consolidate utilities to increase coverage
- (x) Update lite-box using `cast` methods

### Version 0.5.x
- (x) Add `jsdom` to expand testing to modules that use jQuery
- (x) Continue regression test expansion
- (x) Rationalize libraries
- (x) Add lite-box regression tests

### Version 0.6.x
- (x) Remove vendor code from repo and auto-copy on install
- (x) Add native utils `makeThrottleFn` and `makeDebounceFn`
- (x) Add links to updated code style guides
- (x) Replace `install` script with `prep-libs` (v0.6.17+)

### Version 0.7.x
- (x) Move to consturctor approach to easily create multiple
   concurrent namespaced apps using the common xhi core
- (x) Update index page to illustrate
- (x) Make example app less trivial
- (x) Number code library level

### Version 0.8.x
- (x) Work on build system
- (x) Unify shell scripts nomenclature
- (x) Add constructor where only selected components are added
- (x) Add dependency levels for xhi libs

### Version 0.9.x
- (x) Add distribution build system `npm run buildify`
- (x) Add utilities and tests

### Version 1.0.x
- (x) Initial feature complete
- (x) Add utils and tests

### Version 1.1.x
- (x) Rename `npm run prep-libs` to `npm run setup`
- (x) Rename `npm run cover`     to `npm run coverage`
- (x) Rename `npm run covera`    to `npm run publish-coverage`
- (x) Rename `npm run buildify`  to `npm run make`
- (x) Syntax refinements
- (x) Update libs, add express
- (x) Add utils and tests

### Version 1.2.x
- (x) Convert bin/setup in JavaScript
- (x) Configure setup completely in package.json

### Version 1.3.x
- (o) Update code standard quick-reference    (2hr)
- (i) Create VirtualBox OVA for development (8hr)
- (i) Implement `xhi` tool development capabilities
  - (o) 12 publish      : Push to coveralls         ( 4hr)
  - (o) 13 dev\_restart : Implement feature         ( 2hr)
  - (x) 11 build        : Debug build               ( 1hr)
  - (x) 11 build        : Replace buildify module   (24hr)
  - (x) 00 xhi help
  - (x) 01 install
  - (x) 02 setup
  - (x) 03 design
  - (x) 04 dev\_pull
  - (x) 05 dev\_upgrade
  - (x) 06 dev\_start
  - (x) 07 dev\_test
  - (x) 08 dev\_lint
  - (x) 09 dev\_cover
  - (x) 10 dev\_commit
  - (x) 14 dev\_stop
- (x) Tool enhancements
  - (x) `xhi setup`     : Implement env prequisites and `lib/xhi_state.json`
  - (x) `xhi setup`     : Auto-create `xhi_state.json` if required
  - (x) `xhi build`     : Create build directory like `dist/\<build-number\>`
  - (x) `xhi build`     : Link `dist/latest` to latest build
  - (x) `xhi build`     : Do not auto-increment build until next commit
  - (x) `xhi dev_cover` : Move to `dist/\<build-number\>` directories
- (x) Update code standard
- (x) Update all NPM lifecycle scripts to use `xhi` 
    - (x)"help" : "bin/xhi help",
    - (x)"make" : "bin/xhi make",
    - (x)"setup": "bin/xhi setup",
    - (x)"test" : "bin/xhi test",
    - (x)"xhi"  : "bin/xhi"
    
### Version 1.4.x
- (i) Create AMI image for deployment
- (o) Test load times using remote server
- (o) `xhi` tools enhancements
  - (o) `xhi dev_start, prod_start` HTTPS : Use LetsEncrypt to use HTTPS by default
  - (o) `xhi dev_start, prod_start` HTTP/2: Configure for HTTP/2 if feasible
  - (o) `xhi build` convert: buildify Bash to JS, use `package.json` config
  - (o) `xhi build` convert: superpack Perl to JS, use `package.json` config
  - (o) `xhi deploy` implement: Add configuration and capability
  - (o) `xhi publish` : Push to NPM
- (o) Increase richness of example app(s)
---
## Similar Projects
[absurd.js][_26], [responsive.js][_27]

## End

[_0A]:img/hi_score.png
[_00]:https://www.manning.com/books/single-page-web-applications
[_01]:http://mmikowski.github.io/no-frameworks
[_02]:http://www.amazon.com/dp/1617290750
[_03]:https://github.com/mmikowski/hi_score/raw/master/doc/standard/js-quick-ref.pdf
[_04]:https://github.com/mmikowski/hi_score/raw/master/doc/standard/js-code-standard.pdf
[_05]:http://mmikowski.github.io/type-casts/
[_06]:https://nodejs.org/en/download/package-manager/
[_07]:https://docs.google.com/spreadsheets/d/1kLIYKYRsan_nvqGSZF-xJNxMkivH7uNdd6F-xY0hAUM/edit#gid=598969125
[_08]:https://www.topbug.net/blog/2013/04/14/install-and-use-gnu-command-line-tools-in-mac-os-x/
[_09]:https://coveralls.io/github/mmikowski/hi_score
[_10]:http://jquery.org
[_11]:http://powercss.org
[_12]:https://www.npmjs.com/package/jquery.event.dragscroll
[_13]:https://www.npmjs.com/package/jquery.event.gevent
[_14]:https://www.npmjs.com/package/jquery.event.ue
[_15]:https://www.npmjs.com/package/jquery.scrolli
[_16]:https://www.npmjs.com/package/jquery.urianchor
[_17]:https://www.npmjs.com/package/taffydb
[_18]:https://www.npmjs.com/package/coveralls
[_19]:https://www.npmjs.com/package/istanbul
[_20]:https://www.npmjs.com/package/jsdom
[_21]:https://www.npmjs.com/package/jslint
[_22]:https://www.npmjs.com/package/nodeunit
[_23]:https://www.npmjs.com/package/node-inspector
[_24]:https://www.npmjs.com/package/uglifycss
[_25]:https://www.npmjs.com/package/uglifyjs
[_26]:http://absurdjs.com/
[_27]:http://www.responsivejs.com/
[_28]:https://github.com/mmikowski/hi_score
[_29]:https://github.com/mmikowski/hi_score/issues
[_30]:https://www.npmjs.com/package/font-awesome
[_31]:https://www.npmjs.com/package/open-sans-fontface
[_32]:https://www.npmjs.com/package/sprintf-js
[_33]:https://www.npmjs.com/package/mysql2
[_34]:https://www.npmjs.com/package/mongodb
[_35]:https://www.npmjs.com/package/clusterjs
[_36]:https://www.npmjs.com/package/express
[_37]:https://www.npmjs.com/package/websocket
[_38]:https://docs.npmjs.com/misc/scripts

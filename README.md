![hi_score][_0A]
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

*A modern full-life-cycle starter project for SPAs*

## Overview
This is an SPA starter project that installs best-in-class assets and tools to save time and guide best practice. Install **hi_score** today and start writing Test-driven native JS client code immediately. The project comes with recommended libraries, but feel free to swap them out as needed. [That's the point][_01].

## Features
- Code coverage at 98.9% per coveralls.io using Istanbul
- Fractal MVC architecture and proven file structure per the diagram below
- Vendor asset management (`npm install && npm run setup`) including support for executables, stylesheets, fonts, images, and libraries and automated patching.
- Libraries written to exacting [standards][_03] to ensure readability and modularity
- Full code [standard][_03] and [quick-reference guides][_04] included
- Automatic namespacing and run-time control of CSS using [PowerCSS][_11]
- Automatic commit-hook linting using JSLint, whitespace check, and strict checks (`git commit...`)
- Automatic in-line browsable HTML documentation using markdown and pandoc (`git commit...`)
- TDD and regression tests using Nodeunit + JSDOM (`npm test`)
- Type safety with [type-cast][_05] libraries
- Build compression **including object properties** (`npm run make`)
- Creation of distribution-ready `build/dist` from build process (`npm run make`)
- Two simple demo apps that show compression and namespacing (`npm run make`)

## Quick start
```bash
  mkdir -p ~/GitHub
  cd ~/GitHub
  git clone git@github.com:mmikowski/hi_score.git
  cd hi_score
  npm install && npm run setup
```

## Code Style
We use the code style presented in [Single Page Web Applications - JavaScript end-to-end][_00] (see reviews on [Amazon][_02]). The [quick reference][_03] and the [full code standard][_04] are available online and are included in the `docs` directory.

## Architecture
The `xhi` libraries are structured to facilitate loose coupling but strict call precidence. For example the `xhi/00.js` library must be loaded to the browser before any other `xhi` code, and it may not call any library with a higher precidence number. The `08.app.js`, in comparison, must be loaded after all the `00-07` libraries, but it may call any library of the same or lower precidence:

```
  /|                                                       //////
 +  ======================== API CALLS =========================
  \|                                                       \\\\\\

  +---------+    +----------+                       +----------+
  | 02.data |    | 03.model |<--+-------------------|  Shell   |
  |  Data   |<---|  Model   | ..... events .....))) | 07.shell |
  |  Fetch  |    +----------+            :          +----------+
  +---------+      |                     :                    |
       |           |                     :      +---------+   |
       |           |                     :      | 06.lb   |   |
       |           |                     :..))) | litebox |<--+
       |           |  +----------+       :      | feature |   |
       v           |  | Browser  |<--+----------+---------+   |
  +---------+      |  |  Utils   |   |   :                    |
  | 01.util |      |  | 04.utilb |   |   :      +---------+   |
  |  Utils  |<-----+--+----------+   |   :      | 06.*    |   |
  +---------+                        |   ...))) | feature |<--+
        |                            |          | modules |   |
        v                            +----------+---------+   |
  +-----------+                      |                        |
  |   00.js   |                      |      +-------------+   |
  | namespace |                      |      | 05.css_*    |   |
  +-----------+                      |      | 06.css      |<--+
                                     |      | feature css |
                                     +------+-------------+
 \\\\\\                                                       |\
  ========================== DATA FLOW =======================| +
 //////                                                       |/
```

We use model events to broadcast changes to the Shell and Feature modules and we keep our feature modules isolated from each other. This enhances portability and quality.

## Browser compatibility
Our baseline compatibility is IE9+. Those supporting IE 8 have our sympathy.

## Development and deployment
### Ubuntu 16.04, 16.10, 17.04
Everything should just work on recent Ubuntu and derivative distributions like Mint or Kubuntu. Here are the steps to install prequisites on Ubuntu 17.04:

```bash
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
Other modern Linux distributions should generally work as long as the same tools can be installed as as above. It works fine on CentOS with development libraries installed:

```bash
 yum install gcc gcc-c++ make openssl-devel
```

See [this guide][_06] for NodeJS package installation on other Linux distros. Here is a more [generic guide][_07] for Kubuntu and Ubuntu.
### Virtual Machine
Use AWS or a Virtual Box image using Ubuntu 16.04 Server using the the same steps above.

This is probably the best way to get familiar with the project. Any work here will pay off during deployment as **hi\_score** is designed to run on industry-standard Ubuntu servers, cloud instances like Amazon EC2, and containers.

### Mac
We recommend using a virtual machine if possible. However one should be able to develop natively on Mac. At the very least one will need Bash 4+, [GNU Core utilities][_08], NodeJS, Git, PanDoc, and SSH.

### Windows
We recommend using a virtual machine as detailed above. Installation *might* work with the new Linux subsystem on Windows 10 but we don't have any experience with it.

## Use
### Installation
Use the **Quick start** guide to install **hi\_score** and prepare it for development. One can also use `npm install hi_score` but the `git` method is preferred. No errors should be reported.

### Testing
Use `npm test` to run the regression tests. You may expand tests by adding to the `test/xhi_level_0` file. Tested `xhi` modules include the root namespace (`00.js`), the utilities (`01.util.js`), the browser utilities (`04.utilb.js`), and the litebox (`06.lb.js`).

### Coverage
Use `npm run coverage` to calculate code coverage. We can open the `coverage/lcov-report/index.html` file with a browser to inspect coverage.  We use the excellent `Istanbul` code coverage tool along with the JSDOM package. Current coverage is reported at the top of this document.

### Publish coverage
Use `npm run publish-coverage` to publish a report to the coveralls.io website. The process to set up coveralls is described in `hi_score/README.coveralls.md`.

### Build
Use `npm run make` to create a distribution for deployment. The client deployment files are found in `build/dist`.  We can inspect our sample applications as follows:

```bash
  cd ~/GitHub/hi_score
  npm run make
  cd build/dist
  google-chrome ex01.html ex02.html
```

Yes, we know the examples are lame. We are working on that.

### Update
One may update all the npm libraries, assets and the `package.json` file as follows:

```bash
PATH=$PATH:node_modules/.bin

# Check module versions
ncu

# Update package and manifest
ncu -u --packageFile package.json

# Reinstall vendor assets
npm run setup
```

## Namespacing
When we open our example apps (`google-chrome ex01.html ex02.html`) we see they provide near-identical features and share a great deal of code and assets. However, they use separate *namespaces* to avoid data collisions. Namespaces enable us to provide a suite of web apps that share a great deal of code but have instances and data cleanly isolated. With namespacing, one can trace behaviors to the controlling code faster and with greater accuracy.

When we view the Example 1 app we can open the browser development tools (press `<shift>-<ctrl>-i` or `<shift>-<cmd>-i` on a Mac) and enter `ex01` into the JavaScript console to inspect that value. We can see that `ex01` is the single variable that contains all our app code. When we enter `ex02` we see that it is `undefined`. When we visit the Example 2 we can see that `ex01` is `undefined` and `ex02` contains all our app code.

We namespace our CSS classes as well. When we inspect the HTML of the Example 1 app we can see that nearly all classes start with an `ex01-` prefix. When we inspect Example 2 tab we find the prefix is `ex02-`. As with the JavaScript namespacing, the prefixes are hierarchical. For example, the `ex02-_lb_` class was generated for use by the `ex02-_lb_` module.

## Vendor assets
Use `npm run setup` to deploy vendor assets. The configration for vendor assets are in `package.json`.  The `devDependencies` map listing the assets, `xhiVendorAssetGroupTable` lists the deployment groups and files.

Assets are copied to their destination directory with their version number appended to their names. The `.gitignore` file instructs `git` to ignore all these files as their development management is external to our project. **Everytime `npm setup` is run the vendor directories are deleted and recreated**.

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
- [jslint][_21]: Linting for commit hook
- [nodeunit][_22]: Unit testing
- [node-inspector][_23]: Debugging
- [uglifycss][_24]: CSS minification
- [uglifyjs][_25]: JS minitifcation
- buildify: Build script

### Styling assets
Vendor CSS libraries are copied to the `css/vendor` directory. We copy the Font Awesome CSS files to this directory:

- [Font Awesome][_30]: Icon fonts

## Apply patches
Use `npm run setup` to apply patches. The configuration for patches are in `package.json` in the `xhiPatchMatrix` map. The patches are stored in the `patch` directory.

The patches mechanism allows us to use great tools tweaked for our needs while maintaining the upstream source. For example, we patch `uglify-js` to support object property name compression and shuffling by `superpack`.

## Build a distribution
Use `npm run make` to build a distribution. The build script concatenates, compresses, and obsufucates JavaScript and CSS. It copies only the required assets into the the distribution directory (`build/dist`). The result can load up to 10x faster and typically consumes only 5% of the disk space of the development code. We can inspect the files and disk usage as follows:

```bash
  cd ~/GitHub/hi_score

  # Make sure we have built the distribution
  npm install && npm run setup && npm test && npm run make

  # Get disk usage of all development files
  du -sh .

  # Inspect distribution directory
  cd build/dist
  tree
  du -sh .
```

The `buildify` build script uses `superpack` to analyze variable names and object properties and replaces them with shuffled keys. The shortest keys are used for the most-used symbols. It reports the symbol-to-key mapping and the frequency of use which makes further optimizations by pruning code easier. Projects with many object properities can be compressed an additional 50% using `superpack`.

Buildify reduces the dozens of HTTP calls to just a few. This can reduce load time significantly as illustrated below.

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

### TODO
- (o) Test load time using remote server
- (o) Provide unique build number like build/0001/
- (o) Add deploy capability
- (o) Move coverage reports to build/xxxx/ directories
- (o) Convert buildify from Bash to JavaScript using package.json manifest
- (o) Convert superpack from Perl to JavaScript using package.json manifest
- (o) Increase richness of example app

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

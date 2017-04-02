# hi\_score
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

An SPA template using best-in-class libraries, assets, and architecture
as found in [Single Page Web Applications - JavaScript end-to-end][_00].

## Quick install
```bash
$ git clone git@github.com:mmikowski/hi_score.git
$ cd hi_score
$ npm install && npm run setup
```

## Hello World Example

```html
  <!doctype html>
  <html>
    <head>
      <script src="js/vendor/jquery-3.1.1.js"></script>
      <script src="js/vendor/pcss-1.3.5.js"></script>
      <script src="js/vendor/pcss.cfg-1.3.5.js"></script>
      <script src="js/vendor/jquery.event.gevent-1.1.6.js"></script>
      <script src="js/vendor/jquery.event.ue-1.3.2.js"></script>

      <script src="js/xhi/00.js"></script>
      <script src="js/xhi/01.util.js"></script>
      <script src="js/xhi/02.data.js"></script>
      <script src="js/xhi/03.model.js"></script>
      <script src="js/xhi/04.utilb.js"></script>
      <script src="js/xhi/05.css_base.js"></script>
      <script src="js/xhi/05.css_lb.js"></script>
      <script src="js/xhi/05.css_shell.js"></script>
      <script src="js/xhi/06.css.js"></script>
      <script src="js/xhi/06.lb.js"></script>
      <script src="js/xhi/07.shell.js"></script>
      <script src="js/xhi/08.app.js"></script>

      <script>
      $(function () {
        xhi._makeApp_( 'ex01' );

        ex01._shell_._initModule_( $('body') );
        ex01._lb_._showLb_({
          _title_html_   : 'Hello World',
          _content_html_ : '<p>Grab the title bar to drag.</p>'
        });
      });
      </script>
    </head>
    <body></body>
  </html>
```

## Overview
There it is again. The new *hot* SPA framework that makes our current
one obsolete. Now we have to unlearn everything from the old and reinvest
in the new *hotness*. Some of us have spent far more time learning
intricate framework DSLs than the JavaScript we need. Are we ready to get
off that treadmill?

[Do we really want an SPA framework?][_01] If not, then **hi\_score**
is here to help. We provide an ever improving set of
best-in-class libraries that we manage instead of having a framework
that controls us. We thought of calling it `low-score` or `under-dash`
but decided to aim higher.

## The Goal
Provide an SPA starter project that installs best-in-class assets and tools to
save time and guide best code practices.

## Key attributes
- Download and management of best-in-class JS libs and fonts [npm run setup]
- A commit hook which checks for whitespace, JSLint, and tests [npm run setup]
- Regression tests (1270+ assertions) [npm run test]
- Code coverage reports (currently 98.9%) [npm run cover]
- Integration to Coveralls [npm run covera]
- Compressed, deployment-ready code in seconds [npm run build]
- Automatic processing of markdown files to browsable HTML (README.md ->
  index.html)

**hi\_score** also features fractal MVC architecture, type safety with typecasting, best practice style (including style guides and a cheat sheet), and two simple example applications.

## Code Style
We use the code style presented in
[Single Page Web Applications - JavaScript end-to-end][_00]
(see reviews on [Amazon][_02]). The [quick reference][_03] and the
[full code standard][_04] are available online.

## Architecture
The `xhi` libraries are structured to facilitate loose coupling but strict call
precidence. For example the `00.js` library must be loaded to the JavaScript
environment before any other `xhi` code, and it may not call any library with
a higher precidence number. The `08.app.js`, in comparison, must be loaded
after all the `00-07` libraries, but it may call any library of the
same or lower precidence:

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

We use model events to broadcast changes to the Shell and Feature modules,
and we keep our feature modules isolated from each other. This enhances
portability and quality.

## Browser compatibility
Our baseline compatibility is IE9+. If you are targeting IE 8, you have our
sympathy.

## Development environment
### Ubuntu 16.10
Everything should just work on Ubuntu 16.10 as that is the development OS
for **hi\_score**. There are a few prerequisites that many developers may
already have installed:

```bash
  sudo apt-get install build-essential openssh-server git pandoc
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  sudo apt-get install -y nodejs
```

### Other Linux distributions
Other modern *distros* generally work as long as the same tools can
be installed as for Ubuntu 16.10 server. It works fine on CentOS 6.5, for
example.

See [this guide][_06] for NodeJS package installation on other Linux
distros. Here is a more [generic guide][_07] for (k)Ubuntu.

### Virtual Machine
Use AWS or a Virtual Box image using Ubuntu 16.10 server using the the same
steps as Ubuntu 16.10 server, above.

This is probably the best way to get familiar with the code if you are not
already running Linux.

### Mac
We recommend using a virtual machine if possible. However one should
be able to develop natively on Mac. At the very least one will need Bash 4+,
[GNU Core utilities][_08],  NodeJS, Git, PanDoc, and SSH.

### Windows
We recommend using a virtual machine as detailed above. Installation
*might* work with the new Linux subsystem on Windows 10 but we don't
have any experience with it.

### Contribute
If you have installed the code on a platform other than Ubuntu 16.10
we would appreciate a write up so we can add to this document for the
benefit of others.

## Development
### Install
Install **hi\_score** dependencies and then copy vendor libraries.

```bash
  home$ git clone git@github.com:mmikowski/hi_score.git
  home$ cd hi_score
  hi_score$ npm install
  hi_score$ npm run setup
```

One can also use `npm install hi_score` but the git method is preferred.
No errors should be reported.

### Test
Run the regression tests through **npm**.

```bash
  hi_score$ npm test
```

The tests for the `xhi` libraries currently cover the
root namespace (`00.js`), the utilities (`01.util.js`),
the browser utilities (`04.utilb.js`) and the litebox feature module
(`06.lb.js`). We plan to expand coverage to include data and models
in subsequent releases.

### Check coverage
Check the code coverage by running the `cover` script.

```
  hi_score$ npm run cover
  hi_score$ google-chrome coverage/lcov-report/index.html
```

We use the excellent `Istanbul` code coverage tool along with the JSDOM
package. Previously we had used `nodeunitb` for testing but was unsuccessful
in getting usable coverage reports. Current coverage is reported at the top of
this document.

### Update coveralls (optional)
If you create a new fork you may send a coveralls report as shown in the [master
 branch site][_09]. The process to set up coveralls is described in
`hi_score/COVERALLS.md`.

```bash
  hi_score$ npm run covera
```

### Build
We employ `buildify` and `superpack` to prepare the code for production.
This is a generalization of a system that has been in use on many production
sites for over 5 years and is currently used on some very high-volume sites
(100m views per day). We continue to improve feedback and usability.

```bash
  hi_score$ npm run build
  hi_score$ cd build/dist
  dist$ google-chrome ex01.html ex02.html
```

In this example the build process creates two isolated applications that share
resources like fonts, libraries, and images.  This is generally the preferred
approach when building a suite of web applications.

### Update
One may update all the npm libraries, npm assets, and the `package.json` file
with `npm update -D`. If we want these changes to propagate, we must run
`npm run setup` again to update the vendor libraries, and update the
`index.html` file to point to the updated versions. We expect to automate
the last step in future updates.

## Namespacing
After installation we can control-click the following links to inspect
the uncompressed example applicaitons.

- [Example 1](./ex01.html)
- [Example 2](./ex02.html)

Yes we know the examples are lame. We're working on that.

Both of the applications use the `xhi` libraries and provide nearly
identical features yet *they have completely separate namespaces.*
We can use the Chrome developer tools to inspect these differences.
Press `<shift>-<ctrl>-i` (or `<shift>-<cmd>-i` on a Mac) to open these tools.

When we view the Example 1 tab we can type `ex01` into the JavaScript console
and press return and see that this single variable points to all our unique
code in this application. However, if we type `ex02` we see that this
variable is `undefined`, as it should be. If we visit the Example 2 tab we
can see that the opposite is true - `ex01` is `undefined` and `ex02` contains
all our application code. This namespacing allows us to provide a suite of
web applications that share the same UX without interferring with each other.

This name spacing extends to CSS as well. If we inspect the HTML in the
Example 1 tab, we can see that nearly all classes start with an `ex01-` prefix,
whereas the Example 2 tab uses `ex02-`.

## Vendor assets
All vendor assets are listed in the `devDependencies` map in the
`package.json` file. If you want to add a vendor asset, the best method is to
add the npm package there and then update the `bin/setup` script
to copy the asset to the correct directory: `js/vendor/`,
`css/vendor`, `font/vendor`, or `img/vendor`.

    "font-awesome"            : "4.7.0",
    "jquery"                  : "3.2.0",
    "jquery.event.dragscroll" : "1.0.0",
    "jquery.event.gevent"     : "1.1.6",
    "jquery.event.ue"         : "1.3.2",
    "jquery.scrolli"          : "1.0.1",
    "jquery.urianchor"        : "1.3.5",
    "open-sans-fontface"      : "1.4.0",
    "powercss"                : "1.3.5",
    "taffydb"                 : "2.7.3",

    "clusterjs"               : "0.7.1",
    "express"                 : "4.15.2",
    "mongodb"                 : "2.2.25",
    "mysql2"                  : "1.2.0",
    "websocket"               : "1.0.22",

    "coveralls"               : "2.12.0",
    "istanbul"                : "0.4.5",
    "jsdom"                   : "9.12.0",
    "jslint"                  : "0.10.3",
    "node-inspector"          : "0.12.10",
    "nodeunit"                : "0.11.0",
    "uglifycss"               : "0.0.25",
    "uglifyjs"                : "2.4.10"

### JavaScript
Client libraries are copied to `js/vendor` directories with their
version number appended to their names.  This makes them
available via the web server.  These include:
- [Font Awesome][_30]: Icon fonts
- [jQuery][_10]: DOM manipulation
- [PowerCSS][_11]: JS-powered CSS
- [jQuery Plugin: event.dragscroll][_12]: Inertia scroll
- [jQuery Plugin: event.gevent][_13]: Global events
- [jQuery Plugin: event.ue][_14]: Touch and desktop gestures
- [jQuery Plugin: scrolli][_15]: Scroll indicators
- [jQuery Plugin: urianchor][_16]: SPA routing
- [Open Sans][_31]: OSS Font face
- [SprintF][_32]: Sprintf library
- [TaffyDB][_17]: Client data management

Libraries used for the node server:

- [clusterjs][_34]: Server multiplexer
- [express][_36]: Minimalist Sinatra HTTP server
- [mongodb][_34]: Official mongodb node client
- [mysql2][_35]: Faster mysql interface
- [websocket][_37]: Websockets interface

Libraries used for development and build include:

- [coveralls][_18]: Code coverage reporting
- [istanbul][_19]: Code coverage
- [jsdom][_20]: DOM mock for testing
- [jslint][_21]: Linting for commit hook
- [nodeunit][_22]: Unit testing
- [node-inspector][_23]: Debugging
- [uglifycss][_24]: CSS minification
- [uglifyjs][_25]: JS minitifcation
- buildify + superpack: Build system

### CSS
CSS libraries are copied to the `css/vendor` directory with their
version number appended to their names. We currently include
the Font Awesome library.

### Fonts
Font files are copied to the `font/vendor` directory with their
version number appended to their names. We currently include
the open-sans-webfont and Font Awesome files.

## Distribution
This is where it all comes together. The build system removes everything from
the distribution except for the essentails.  It also compresses, obsufucates, 
and superpacks. The result can load up to 10x faster and typically consumes 
only 5-10% of the disk space of the development code.

The results of a build are found in `build/dist`. Take a look at how few files
and little disk space is used in our distribution:

```bash
  hi_score$ cd build/dist
  dist$ tree
```

**Superpack** analyzes symbol use and replaces them with the smallest
keys available prioritized by frequency. It reports this frequency
which makes further optimizations by pruning code easier. On larger code
projects with many object properities **Superpack** has been
shown to reduce minimized code by an additional 50%.

Reducing a dozen or so HTTP requests to one for a single, highly compressed
JS file can reduce load time to 10% of prior values.  The table below shows
some of the results:

| Attribute   | Original (%)     | Minified (%)     | Superpack (%)    |
|-------------|-----------------:|-----------------:|-----------------:|
| Size        | 601,027 (100.0%) | 215,400 ( 35.8%) | 162,494 ( 27.1%) |
| Gzipped     | 151,716 ( 25.2%) |  62,895 ( 10.4%) |  57,275 ( 09.5%) |

| Attribute   | Original         | Minified (%)     | Superpack (%)    |
|-------------|-----------------:|-----------------:|-----------------:|
| HTTP reqs   |      27 (100.0%) |       4 ( 15.4%) |       4 ( 15.4%) |
| Local ms    |     231 (100.0%) |     166 ( 71.2%) |     144 ( 62.3%) |
| Deploy Size |           121 MB |    8 MB (  6.6%) |    8 MB (  6.5%) |

The load time measurements were made using a local HTTP server which is almost
certainly a best-case scenario. We hope to add results for a remote server soon.

## Contribute!
Any improvements or suggestions are welcome through the [issues tracker][_29].
Pull requests are especially appreciated.

## Release Notes
### Copyright (c)
2016 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

### License
MIT

### Version 0.0.x
- (x) Initial preparation

### Version 0.1.x
- (x) Library updates

### Version 0.2.x
- (x) Regression and integration testing
- (x) Rudimentary sample application

### Version 0.3.x
- (x) Add code coverage
- (x) Replace `getDeepMapVal` and `setDeepMapVal` with much more powerful
  and tested `getStructData` and `setStructData` which empowers you with
  transversal and creation of arbitrary mixed list and map structures.
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
- (x) Rename `npm run buildify` to `npm run build`
- (x) Update libs, add express
- (i) Add utils and tests
- (p) Increase complexity of example applications

## Similar Projects
[absurd.js][_26], [responsive.js][_27]

## End

[_00]:https://www.manning.com/books/single-page-web-applications
[_01]:http://mmikowski.github.io/no-frameworks
[_02]:http://www.amazon.com/dp/1617290750
[_03]:https://github.com/mmikowski/hi_score/raw/master/doc/standard/js-cheat-sheet.pdf
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

# hi\_score
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

An SPA template using best-in-class libraries, assets, and architecture
as found in [Single Page Web Applications - JavaScript end-to-end][_00].

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

## Code Style
We use the code style presented in
[Single Page Web Applications - JavaScript end-to-end][_00]
(see reviews on [Amazon][_02]). The [quick reference][_03] and the
[full code standard][_04] are available online. The architecture is
illustrated in the quick reference.

## The Goal
Provide an SPA template that not only includes a sample applicaiton, but also
downloads and sets up best-in-class libraries, assets, and architecture.
This environment will progress as technology and support evolve.

## Key attributes
Attributes that have yet to be "turned on" are marked WIP:

- A fast, one-touch build system (WIP)
- Highly Compressible
- Testable
- Commit-hook enforce quality code (JSLint and regression test)
- Flexible
- Fractal MVC architecture
- Type safety [with typecasting][_05]
- Best practice style
- Stable (WIP)

As of 0.7.0 we have adopted a constructor approach to create a
**hi\_score**-based application. We have isolated the `xhi` libraries to
the `js/xhi` directory, which leaves the `js` directory open for
inclusion of the project libraries.  We have also adjusted the `xhi` file
names to describe their include and call precidence.

## Architecture
Are libraries are structured to facilitate loose coupling but strict call
precidence. For example the `00.js` library must be loaded to the JavaScript
environment before any other `xhi` code, and it may not call any library with
a higher precidence number. The `08.app.js`, in comparison, must be loaded
after all the `00-07` libraries, but it may call any library of the
same or lower precidence.  See the diagram below.

```
 <-------------------------- API CALLS ------------=========<<<<
  +---------+    +----------+                       +----------+
  | 02.data |    | 03.model |<----------------------|  Shell   |
  |  Data   |<-- |  Model   | ..... events .....))) | 07.shell |
  |  Fetch  |    +----------+            .          +----------+
  +---------+      |                     .                    |
       |           |  +-------------+    .      +---------+   |
       |-----------+--| 05.css_*    |    .      | 06.lb   |   |
       |              | 06.css      |    ...))) | litebox |<--|
       |              | feature css |    .      | feature |   |
       v              +-------------+    .      +---------+   |
  +---------+               |            .                    |
  | 01.util |               v            .      +---------+   |
  |  Utils  |<------ +----------+        .      | 06.*    |   |
  +---------+        | Browser  |        ...))) | feature |<--+
        |            |  Utils   |               | modules |
        v            | 04.utilb |               +---------+
  +-----------+      +----------+
  |   00.js   |
  | namespace |
  +-----------+
 >>>>=========-------------- DATA FLOW ------------------------>
```

We use model events to communicate changes to the Shell and Feature modules,
and we keep our feature modules isolated from each other. This enhances
portability and quality.

## Browser compatibility
Our baseline compatibility is IE9+. If you are targeting IE 8, you have our
sympathy.

## Development environment
### Linux
We deploy on Linux so this is our baseline.  As long as you have core
development libs, git, npm, and node installed on your distro, things
should just work. The minimum on Ubuntu Server 16.10 is probably this:

```bash
  sudo apt-get install build-essential openssh-server git pandoc
  curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
  sudo apt-get install -y nodejs
```

See [this guide][_06] for NodeJS package installation on other Linux
distros. Here is a more [general guide][_07] for (k)Ubuntu.

### Mac
We recommend using a virtual machine as detailed below.  However you
may get **hi_score** to run natively on Mac. At the very least you'll
need Bash 4+ and GNU Core utilities installed along with NodeJS, Git,
PanDoc, and SSH.  This [guide][_08] should help with installation of
the GNU Core utilities.

### Windows
We recommend using a virtual machine as detailed below.  Installation
*may* work with the new Ubuntu subsystem on Windows 10, but we haven't
tested and wouldn't bet on it :)

### Virtual Machine
Since the deployment target is Ubuntu 16.10 Server, one could simply
spin-up an AWS or Virtual Box image running the same for development.
This is probably the best solution for those not already developing
with Linux.

## Development
### Installation
The following will install **hi_score** and all vendor assets and then copy
them to web deployment libraries:

```bash
  npm install hi_score
  cd node_modules/hi_score
  npm install
  npm run prep-libs
  npm test
  npm run cover
```

After preparation one can open the `index.html` file with a browser to view the
sample application, or `coverage/lcov-report/index.html` to check out code
coverage for the core libraries.

### Regression Test
Tests for the xhi libraries currently cover the root namespace
(`xhi.js`), the utilities (`xhi.util.js`), browser utilities (`xhi.utilb.js`)
and litebox (`xhi.lb.js`). We plan to include tests for the example application
data and model in future updates.

### Code coverage
We use Istanbul for code coverage, and it does an excellent job.  We had to
switch to nodeunit + JSDOM to get accurate coverage reports but have had no
other trouble. Local coverage reports are found in
`coverage/lcov-report/index.html`.

If you create a fork you can create a coveralls report as shown in the [master
 branch site][_09]. Please see `COVERALLS.md` which details this installation.

### Update
One may update all the npm libraries, npm assets, and the `package.json` file
with `npm update -D`. If we want these changes to propagate, we must run
`npm run prep-libs` again to update the vendor libraries, and update the
`index.html` file to point to the updated versions. We expect to automate
the last step in future updates.

### Build
We employ `buildify` and `superpack` to prepare the code for production.
We are still finalizing this for general use, but you can sneak a peek right
now if you are ambitious:

```bash
  cd hi_score
  npm run buildify config/ex01.buildify

  cd build/stage
  ls
```

The results of the single JS avascript file is as follows:

| Attribute   | Original        | Minified        | Superpack       |
|-------------|----------------:|----------------:|----------------:|
| Size        | 600,961 ( 100%) | 215,399 (35.5%) | 159,587 (26.6%) |
| Gzipped     | 151,510 (25.2%) | 62,745  (10.4%) | 56,628  (09.4%) |
| % Gzipped   | 151,510 ( 100%) | 62,745  (41.4%) | 56,628  (37.4%) |

Reducing a dozen or so HTTP requests to one for a single JS file also reduces
load time. Superpack analyzes symbol use and replaces them with the smallest
keys available prioritized by frequency. SuperPack reports this frequency
which makes further optimizations by pruning code easier.

We will add further documentation as we complete polishing this feature for
general use.

## Vendor assets
All vendor assets are listed in the `devDependencies` map in the
`package.json` file.  If you want to add a vendor asset, the best method is to
add the npm package there and then update the `bin/prep-libs.sh` script
to copy the asset to the correct directory: `js/vendor/`,
`css/vendor`, `font/vendor`, or `img/vendor`.

## JavaScript
Client libraries are copied to the `js/vendor` directory with their
version number appended to their names.  These include:

- [jQuery][_10] DOM manipulation
- [PowerCSS][_11] JS-powered CSS
- [jQuery Plugin: event.dragscroll][_12] Inertia scroll
- [jQuery Plugin: event.gevent][_13] Global events
- [jQuery Plugin: event.ue][_14] Touch and desktop gestures
- [jQuery Plugin: scrolli][_15] Scroll indicators
- [jQuery Plugin: urianchor][_16] SPA routing
- [TaffyDB][_17]

Libraries used for development and testing are not copied:

- [coveralls][_18] Code coverage reporting
- [istanbul][_19] Code coverage
- [jsdom][_20] DOM mock for testing
- [jslint][_21] Linting for commit hook
- [nodeunit][_22] Unit testing
- [node-inspector][_23] Debugging
- [uglifycss][_24] Minification
- [uglifyjs][_25] Minification

## CSS
CSS libraries are copied to the `css/vendor` directory with their
version number appended to their names.  We currently include
the Font Awesome library.

## Fonts
Font files are copied to the `font/vendor` directory with their
version number appended to their names.  We currently include
the open-sans-webfont and Font Awesome files.

# Contribute!
Any improvements or suggestions are welcome, especially when presented
with a pull request :).

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
- (x) Updates to `xhi._util_`

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
- (wip) Implement npm-base build system for production
- Add constructor where only selected components are added
- Add dependency graph for above
  

## Similar Projects
[absurd.js][_26], [responsive.js][_27]

## End

[_00]:https://www.manning.com/books/single-page-web-applications
[_01]:http://mmikowski.github.io/no-frameworks
[_02]:http://www.amazon.com/dp/1617290750
[_03]:https://github.com/mmikowski/spa/raw/master/js-cheat-sheet-2016.pdf
[_04]:https://github.com/mmikowski/spa/raw/master/js-code-std-2016.pdf
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

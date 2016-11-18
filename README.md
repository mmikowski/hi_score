# hi\_score
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

An SPA template using best-in-class libraries, assets, and architecture
as found in [Single Page Web Applications - JavaScript end-to-end][8].

# Overview
There it is again. The new *hot* SPA framework that makes our current
one obsolete. Now we have to unlearn everything from the old and reinvest
in the new *hotness*. Some of us have spent far more time learning
intricate framework DSLs than the JavaScript we need. Are we ready to get
off that treadmill?

[Do we really want an SPA framework?][7] If not, then **hi_score**
is here to help. Our intention is to provide an ever improving set of
best-in-class libraries that we control, instead of having a framework
that controls us. We thought of calling it `low-score` or `under-dash`
but thought we'd aim higher.

## Code Style
We use the code style presented in
[Single Page Web Applications - JavaScript end-to-end][8] (see reviews on  [Amazon][9]).
The [full code standard][a] and the [cheat-sheet][b] are available online.
The architecture is illustrated in the cheat sheet.

## The Goal
Provide an SPA template that not only includes a sample applicaiton, but also
downloads and sets up best-in-class libraries, assets, and architecture.
This environment will progress as technology and support evolve.
The sample applicaiton will eventually be the application shown on the
`hi\_score` website.

## Key attributes:

- Testable
- Compressible
- Sensible typing
- Flexible
- Modern
- Universal Fractal MVC
- Tiny compared to most frameworks
- Stable
- Commit-hook enforce quality code (JSLint and regression test)
- A fast, one-touch build system

As of 0.6.6 we have isolating the namespace prefix (`xhi`) to the first few
lines all modules and have made them all node-friendly. The result is
highly portable and merge-able code. Merging updates to a **hi\_score**-based
project should now much faster and easier.

## Compatibility
Our baseline compatibility is IE9+. If you are targeting IE 8, you have our
sympathy but not our support. Sorry.

# Steps to develop
## Quick start
The following will install `hi\_score` and all vendor assets and then copy
them to web deployment libraries:

```bash
  npm install hi_score;
  cd node_modules/hi_score;
  npm install;
  npm run prep-libs;
  npm test;
  npm run cover;
```

After preparation one can open the `index.html` file with a browser to view the
sample application, or `coverage/lcov-report/index.html` to check out code
coverage for the core libraries.

## Test
Regression tests for the xhi libraries currently cover the root namespace
(`xhi.js`), the utilities (`xhi.util.js`), browser utilities (`xhi.utilb.js`)
and litebox (`xhi.lb.js`). The sample applicaiton will include data and model
tests as well.

## Updates
One may update all the npm libraries, npm assets, and the `package.json` file with
`npm update -D`. If we want these changes to propagate, we must run `npm run
prep-libs` again to update the vendor libraries, and update the `index.html` file
to point to the updated versions. This last step we expect to automate in the
near future.

## Use coveralls.io
If you create a fork you may submit your coverage report to
coveralls.io. Here are the steps:

```bash
  $ cd hi_score
  $ npm install
  $ npm prep-libs
  $ npm run covera
```

And then point your browser to the `hi_score` [coverage page][10]
to confirm the results have been recorded.

# Vendor assets
All vendor assets are listed in the `devDependencies` map in the
`package.json` file.  If you want to add a vendor asset, the best method is to
add the npm package here and then update the `bin/prep-libs.sh` script
to copy the asset to the correct `vendor/` directory: `js/vendor/`,
`css/vendor', `font/vendor`, or `img/vendor`.

## JavaScript vendor assets
We include the following JavaScript assets. Client libraries are copied to the
`js/vendor` directory with their current version number appended to their
name.

- [jQuery][0] DOM manipulation
- [PowerCSS][1] JS-powered CSS
- [jQuery Plugin: urianchor][2] SPA routing
- [jQuery Plugin: event.gevent][3] Global events
- [jQuery Plugin: event.ue][4] Touch and desktop gestures
- [jQuery Plugin: event.dragscroll][5] Inertia scroll
- [jQuery Plugin: debounce][6] Debounce (throttling)
- nodeunit
- jsdom
- istanbul

Not all libraries are copied to the `js/vendor` directory because
they are not used by the client.  For example, nodeunit, jsdom, and istanbul
are currently used for testing only and are not copied.

## CSS
We have prepared the `bin/prep-libs.sh` script to copy vendor CSS, but we
do not currently copy any vendor CSS assets.

## Fonts
As of 0.6.20, we use the open-sans-webfont package to populate the `font/vendor`
directory during the `prep-libs` stage.

# Other documentation
See this [blog post] which describes the type-saftey features and techniques
available with [hi\_score][14]

# Coverage reference
Below are the steps we used to get coverage working. **You do not have to
do this.**  We've kept it here for reference only!
Many thanks to Elliot Stokes who's [blog post][11] provided most of the
information.

## 1. Install istanbul

```bash
  $ cd hi_score
  $ npm install istanbul --save-dev
```

## 2. Configure git to ignore coverage directory

```bash
  $ cd hi_score
  $ cat 'coverage' >> .gitignore
```

## 3. Run the coverage tool

```bash
  $ cd hi_score
  $ node_modules/.bin/istanbul cover \
  $  node_modules/.bin/nodeunit test/xhi_level_0.js
```

The local report is found in `coverage/lcov-report/index.html`.
The local lcov data is found in `coverage/lcov.info`.

## 4. Integrate to coveralls.io

Sign in to `https://coveralls.io` using your GitHub account. Add the desired
repo by selecting from the list of shown at `https://coveralls.io/repos/new`.
Once you've added a repo, you may then get the token from the detail page,
as shown in `https://coveralls.io/github/mmikowski/hi\_score` at the TR.
Place this token in the `.coveralls.yaml` file. This is **your** token. As I
understand it, this should always be kept private, so we add the configuration
file with this information to the `.gitignore` file.

```bash
  $ cd hi_score
  $ cat .coveralls.yaml >> .gitignore
  $ cat 'repo_token: ---------your-token-here---------' > .coveralls.yaml
```

Run `npm covera` to send a report to coveralls.io. The detailed
command is as follows:

```bash
  $ cd hi_score
  $ npm install coveralls
  $ node_modules/.bin/istanbul cover -x '**/vendor/**' \
  $  node_modules/.bin/nodeunit test/xhi_level_0.js \
  $  && cat coverage/lcov.info | node_modules/.bin/coveralls
```

# Contribute!
If you want to help out, like all npm modules this is hosted on GitHub.
Any improvements or suggestions are welcome, especially when presented
with a pull request :).

# Release Notes
## Copyright (c)
2016 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

## License
MIT

## Version 0.0.x
- (x) Initial preparation

## Version 0.1.x
- (x) Library updates

## Version 0.2.x
- (x) Regression and integration testing
- (x) Rudimentary sample application

## Version 0.3.x
- (x) Add code coverage
- (x) Replace `getDeepMapVal` and `setDeepMapVal` with much more powerful
  and tested `getStructData` and `setStructData` which empowers you with
  transversal and creation of arbitrary mixed list and map structures.
- (x) Updates to `xhi._util_`:
  - Remove `xhi._util_makeListPlus_`  and replaced with
    - getListValCount
    - pushUniqueListVal
    - rmListVal
  - Change `_castBool_` behavior: it now returns the provided
    value only if a true boolean, the alternate value is provided otherwise.
  - Rename `_getLogUtilObj_` to `xhi._getLogObj_`.
    Returns the log object singleton as before.
  - Change `log_obj._setLogLevel_` behavior: it now returns log level
    as set (was true or false).
  - Add more resiliant argument handling.
  - Move `_encodeHtml_` from `xhi._utilb_.js`.
  - Add limited key map capability to `_mergeMaps_`.
  - Delete `_setCmap_` as it was redunant with `_mergeMaps_`.

## Version 0.4.x
- (x) Replace `jscoverage` with much more complete and recent `istanbul`
- (x) Added `cast` routines and detail their use
- (x) Consolidate utilities to increase coverage
- (x) Update lite-box using `cast` methods

## Version 0.5.x
- (x) Add `jsdom` to expand testing to modules that use jQuery
- (x) Continue regression test expansion
- (x) Rationalize libraries
- (x) Add lite-box regression tests

## Version 0.6.x (current)
- (x) Remove vendor code from repo and auto-copy on install
- (x) Add native utils `makeThrottleFn` and `makeDebounceFn`
- (x) Add links to updated code style guides
- (x) Replace `install` script with `prep-libs` (v0.6.17+)
- More sophisticated sample application

# Similar Projects
[absurd.js][12], [responsive.js][13]

# End

[a]:https://github.com/mmikowski/spa/raw/master/js-cheat-sheet-2016.pdf
[b]:https://github.com/mmikowski/spa/raw/master/js-code-std-2016.pdf
[0]:http://jquery.org
[1]:http://powercss.org
[2]:https://www.npmjs.com/package/jquery.urianchor
[3]:https://www.npmjs.com/package/jquery.event.gevent
[4]:https://www.npmjs.com/package/jquery.event.ue
[5]:https://www.npmjs.com/package/jquery.event.dragscroll
[6]:https://github.com/cowboy/jquery-throttle-debounce
[7]:http://mmikowski.github.io/no-frameworks
[8]:https://www.manning.com/books/single-page-web-applications
[9]:http://www.amazon.com/dp/1617290750
[10]:https://coveralls.io/github/mmikowski/hi_score
[11]:http://www.vapidspace.com/coding/2014/01/31/code-coverage-metrics-with-nodeunit/
[12]:http://absurdjs.com/
[13]:http://www.responsivejs.com/
[14]:http://mmikowski.github.io/type-casts/



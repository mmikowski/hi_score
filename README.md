# hi\_score by Michael S. Mikowski
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

A refined set of libraries for SPA development with few dependencies.

## Overview
There it is again. The new *hot* SPA framework that makes our current
one obsolete. Now we have to unlearn everything from the old and reinvest
in the new *hotness*. Some of us have spent far more time learning
intricate framework DSLs than the JavaScript we need. Are we ready to get
off that treadmill?

[Do we really want an SPA framework?][7] If not, then `hi_score`
is here to help. Our intention is to provide an ever improving set of
best-in-class libraries that we control, instead of having a framework
that controls us. We thought of calling it `low-score` or `under-dash`
but thought we'd aim higher.

## Code Style
We use the code style presented in the book book
**Single Page Web Applications - JavaScript end-to-end** found on
[Manning][8] or [Amazon][9]. The cheat sheet is [here][a].
All our libraries pass JSLint. All object keys have an underscore
prefix and suffix like `_this_` which makes them easy targets for
compression.

## The Goal
Provide an architecture guide, starter files, and best-in-class libraries
recommended for SPA development. This environment will progress as
technology and support evolve.

Key attributes:

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

## Who needs TypeScript or Closure?
These frameworks are incredibly complicated mechanisms to provide a level of
type-safety to JS. But do you really need cede control of you JS project to
these monsters to get most of the same benefit?  The answer is
**absolutely not**. In my experience, one can solve almost all JS
type-casting issues in two simple steps: 1. name your variables for type,
and 2. use `cast` methods to ensure type.

### 1. Name your variable for type
See this [reference cheat sheet][a]. This is far easier and transportable
than JSDoc or some vast compiler framework.

### 2. Use `cast` methods to ensure type
These methods coerce the provided value into the requested type. If they
can't, the return a fallback value. They are available in xhi.util.js.
Let's see them in action:

```js
  function getTimeList( arg_map ) {
    var
      map      = __castMap( arg_map, {} ),
      end_ms   = __castInt( map._end_ms_   ),
      start_ms = __castInt( map._start_ms_ )
      ;

    if ( ! ( end_ms && start_ms ) ) { return []; }

    // ... continue logic here
  }
```

This self-documenting functional code replaces the dead-weight that is JSDoc
and overwrought frameworks with a tiny fraction of the effort. See `cast*`
use cases below for more discussion.

## Status
I am currently updating the libraries. They are not complete.

## Third-pary libraries
All third-party libraries are in `vendor` directories and retain
their original names with a version number added. We employ the
following JS libraries:

- [jQuery][0] DOM manipulation
- [PowerCSS][1] JS-powered CSS
- [jQuery Plugin: urianchor][2] SPA routing
- [jQuery Plugin: event.gevent][3] Global events
- [jQuery Plugin: event.ue][4] Touch and desktop gestures
- [jQuery Plugin: event.dragscroll][5] Inertia scroll
- [jQuery Plugin: debounce][6] Debounce (throttling)

We also include webfonts. We have a modified version of Font-Awesome 4.5
and OpenSans. Check out the `font` directory for details.

## Compatibility
Our baseline compatibility is IE9+. If you are targeting IE 8, you have our
sympathy.

## Install
As of 0.6.0, this repository no longer directly holds dependent libraries but
instead copies them from their npm repositories locations instead.  It is a
single step process:

```bash
  $ cd hi_score
  $ npm install
```

After installation one can open the index.html file with a browser to view the
rudimentary sample application.

## Update
One may update all the npm libraries and the `package.json` file with `npm
update -D`.  If we want these changes to propagate, we must run `npm install`
 again to update the vendor libraries, and update the `index.html` file to
 point to the updated versions.  This last step we expect to automate in the
 near future.

## Test
Regression tests for the xhi libraries currently cover the root namespace
(`xhi.js`), the utilities (`xhi.util.js`), browser utilities (`xhi.utilb.js`)
and litebox (`xhi.lb.js`).  The sample applicaiton will include data and model
tests as well.

### Run the tests

```bash
  $ cd hi_score
  $ npm install
  $ npm test
```

### Inspect the coverage
We recommend you inspect your coverage submitting to GitHub. To
do so simply run the npm `cover` script, as shown below.

```bash
  $ cd hi_score
  $ npm run cover
  $ google-chrome coverage/lcov-report/index.html
```

### Use coveralls.io
After you commit you should submit your coverage report to
coveralls.io. Here are the steps:

```bash
  $ cd hi_score
  $ npm install
  $ npm run covera
```

And then point your browser to the `hi_score` [coverage page][10]
to confirm the results have been recorded.

### Coverage reference
Below are the steps I used to get coverage working.
Many thanks to Elliot Stokes who's [blog post][11] provided most of the
information.

#### 1. Install istanbul

```bash
  $ cd hi_score
  $ npm install istanbul --save-dev
```

#### 2. Configure git to ignore coverage directory

```bash
  $ cd hi_score
  $ cat 'coverage' >> .gitignore
```

#### 3. Run the coverage tool

```bash
  $ cd hi_score
  $ node_modules/.bin/istanbul cover \
  $  node_modules/.bin/nodeunit test/xhi_level_0.js
```

The local report is found in `coverage/lcov-report/index.html`.
The local lcov data is found in `coverage/lcov.info`.

#### 4. Integrate to coveralls.io

Sign in to `https://coveralls.io` using your GitHub account. Add the desired
repo by selecting from the list of shown at `https://coveralls.io/repos/new`.
Once you've added a repo, you may then get the token from the detail page,
as shown in `https://coveralls.io/github/mmikowski/hi_score` at the TR.
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

## Contribute!
If you want to help out, like all npm modules this is hosted on GitHub.
Any improvements or suggestions are welcome, especially when presented
with a pull request :).

If you want to contribute first fork the repository. Then set it up for
development:

```bash
  $ cd hi_score
  $ # Install development libs
  $ npm install
  $ # Install commit hook
  $ cd .git/hooks
  $ ln -s ../../bin/git-hook_pre-commit pre-commit
  $ cd ../../

  $ # The following should run successfully
  $ npm test
  $ npm run cover

  $ # you will need to set the .coveralls.yml token for this:
  $ npm run covera

  $ # You should see regression tests run
  $ git commit -a
```

## Notes
### Cast Use Case 1
Guarantee our returned value is always the desired type by providing
an appropriate default value:

```js
  map  = __castMap(  map.details, {} );
  list = __castList( map.list,    [] );
  str  = __castStr(  map.descr,   '' );
  int  = __castInt(  map.count,    0 );
```

This is useful when our default values are sane and we want our routines to be
"bullet-proof". It is especially useful during function initialization to
ensure an argument map is indeed a map.

### Cast Use Case 2
Guarantee our returned value is either the desired type *or*
`undefined`. In these cases, we typically adjust our code flow to avoid
unusable values.

```js
  int = __castInt( map.count );
  if ( int === undefined ) { return; } // Cannot coerce into integer

  str = castStr( map.ding );
  if ( str === undefined ) { return; } // Cannot coerce into a string
```

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

### Version 0.6.x (current)
- (x) Remove vendor code from repo and auto-copy on install
- (x) Add native utils `makeThrottleFn` and `makeDebounceFn`
- More sophisticated sample application

## Similar Projects
[absurd.js][12], [responsive.js][13]

## End

[a]:https://github.com/mmikowski/spa/raw/master/cheat-sheet.pdf
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


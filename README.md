# hi\_score by Michael S. Mikowski
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

A refined set of libraries for SPA development with few dependencies.

## Overview
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
We use the code style presented in the book book
**Single Page Web Applications - JavaScript end-to-end** found on
[Manning][8] or [Amazon][9]. The [full code standard][a] and the
[cheat-sheet][b] are available online. The architecture is illustrated in the
cheat sheet.

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

## Type safety
We don't need cede control of our application to complex frameworks like
TypeScript or Closure to ensure type safety.  Instead, we can solve most JS
type issues in **two** simple steps that will actually accelerate development
and enhance collaboration.

- Name your variables for type, and
- Use `cast` methods to enforce type.

Let's review each step.

### 1. Name your variables for type
It's easy to name variables for type by adding a 2-4 character suffix.
See the [reference cheat sheet][b] or read [full code standard][a].  This
embeds your intentions *in the code* which is much more durable than using
comments to explain variables.

### 2. Use `cast` methods to ensure type
The `cast` methods are simple, self-documenting functions found in the base
utilities library (`xhi.util.js`). They convert a provided argument into the
requested type using standard JS rules. If this is not possible, they return
the alternate value which by default is `undefined`. They are typically used
at the top of functions where arguments are processed.

```js
  var
    __util    = xhi._util_,
    __castInt = __util._castInt_,
    __castMap = __util._castMap_
    ;

  function getTimeList( arg_map ) {
    var
      map      = __castMap( arg_map,    {} ),
      end_ms   = __castInt( map._end_ms_   ),
      start_ms = __castInt( map._start_ms_ )
      ;

    // Return empy array if time range is not provided
    if ( ! ( end_ms && start_ms ) ) { return []; }

    // ... continue logic here
  }
```

Compare this with solutions that use `JSDoc` like TypeScript or
Closure. Both introduce a transpile step to make the comments userful and add
an additional layer of complexity to provide similar benefits.

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
and OpenSans. Check out the `font` directory for details. We plan to soon copy
these files on installation from remote repositories similar to how we
handle JavaScript vendor libraries as of 0.6.0.

## Compatibility
Our baseline compatibility is IE9+. If you are targeting IE 8, you have our
sympathy.

## Prepare libraries
As of 0.6.0, this repository no longer directly holds dependent libraries but
instead copies them from their npm repositories locations instead:

```bash
  $ cd hi_score
  $ npm install
  $ npm run prep-libs
```

After preparation one can open the `index.html` file with a browser to view the
rudimentary sample application.

## Update
One may update all the npm libraries and the `package.json` file with `npm
update -D`.  If we want these changes to propagate, we must run `npm run prep-libs`
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
  $ npm prep-libs
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
  $ npm prep-libs
  $ npm run covera
```

And then point your browser to the `hi_score` [coverage page][10]
to confirm the results have been recorded.

### Coverage reference
Below are the steps I used to get coverage working. **You do not have to
do this.**  I've kept it here for reference only!
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

If you want to contribute first fork the repository. Then prepare the
development libs and the commit hook:

```bash
  $ cd hi_score
  $ npm install
  $ npm prep-libs
```

You can make sure it is working correctly like so:

```bash
  $ npm run cover
```

This should povide a nice HTML coverage report in
`hi_score/coverage/lcov-report/index.html`.  There may be some prerequisite
libraries required. Generally the installation scripts should guide you
through these.

As of 0.6.6 we have isolating the namespace prefix (`xhi`) to the first few
lines all modules and have made them all node-friendly.  The result is
highly portable and merge-able code. Merging updates to a **hi_score**-based
project is fast, easy, and very hard to screw up :)

## Cast use cases
### Guarantee a type
There are many instances where we want to ensure a value is a
desired type.  If the provided value is not of the type, we either want to
*convert* it to the correct type if possible, or *use a sensible default*.
Our `cast` methods provide this as shown below:

```js
function makeCleanFn( arg_map ) {
  var
    map  = __castMap(  arg_map,       {} ),

    fn   = __castInt(  map._fn_,    null ),
    int  = __castInt(  map._count_,    0 ),
    list = __castList( map._list_,    [] ),
    str  = __castStr(  map._descr_,   '' )
    ;
  // Add code here...
}
```

### Ensure an acceptable value
Sometimes we need certain values for a function to proceed properly.
The function argument, for example, may need to exist.  We can adjust the code
accordingly:

```js
function makeCleanFn(  arg_map ) {
  var
    map  = __castMap(  arg_map,     {} ),

    int  = __castInt(  map._count_,  0 ),
    str  = __castStr(  map._descr_, '' ),

    list = __castList( map._list_ ),
    fn   = __castInt(  map._fn_   )
    ;

  // Bail if required values are not provided
  if ( ! ( list && fn ) ) {
    console.warn( '_fn_ and _list_ are required' );
    return false;
  }

  // Add code here...
}
```

The default alternate value for all `cast` methods is always `undefined`.
Here we use this feature to ensure that require arguments are provided.


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
- (x) Add links to updated code style guides
- (x) Replace `install` script with `prep-libs` (v0.6.17+)
- More sophisticated sample application

## Similar Projects
[absurd.js][12], [responsive.js][13]

## End

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



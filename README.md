# hi\_score by Michael S. Mikowski
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

A refined set of libraries for SPA development with few dependencies.

## Overview
There it is again. The new *hot* SPA framework that makes our current
one obsolete.  Now we have to unlearn everything from the old and reinvest
in the new *hotness*. Some of us have spent far more time learning
intricate framework DSLs than the JavaScript we need. Are we ready to get
off that treadmill?

[Do we really want an SPA framework?][7] If not, then `hi_score`
is here to help. Our intention is to provide an ever improving set of
best-in-class libraries that we control, instead of having a framework
that controls us.  We thought of calling it `low-score` or `under-dash`
but thought we'd aim higher.


## Code Style
We use the code style presented in the book book
**Single Page Web Applications - JavaScript end-to-end**
found on [Manning][8] or [Amazon][9].
All our libraries pass JSLint.  All object keys have an underscore
prefix and suffix like `_this_` which makes them easy targets for compression.

## The Goal
Provide an architecture guide, starter files, and best-in-class libraries
recommended for SPA development. This environment will progress as
technology and support evolve.

Key attributes:

- Testable
- Compressible
- Flexible
- Modern
- Universal Fractal MVC
- Tiny compared to most frameworks
- Stable
- Commit-hook enforce quality code (JSLint and regression test)
- A fast, one-touch build system

## Status
I am currently updating the libraries. They are not complete.

## Third-pary libraries
All third-party libraries are in `vendor` directories and retain
their original names with a version number added.  We employ the
following JS libraries:

- [jQuery][0] DOM manipulation
- [PowerCSS][1] JS-powered CSS
- [jQuery Plugin: urianchor][2] SPA routing
- [jQuery Plugin: event.gevent][3] Global events
- [jQuery Plugin: event.ue][4] Touch and desktop gestures
- [jQuery Plugin: event.dragscroll][5] Inertia scroll
- [jQuery Plugin: debounce][6] Debounce (throttling)

We also include webfonts.  We have a modified version of Font-Awesome 4.5
and OpenSans. Check out the `font` directory for details.

## Compatibility
Our baseline compatibility is IE9+.  If you are targeting IE 8, you have our
sympathy.

## Testing
### Regression tests
Regression tests have been added for the xhi libraries, focusing
presently on the utilities.  You can run the tests at any time like so:

```bash
  $ cd hi_score
  $ npm install
  $ npm test
```

### Coverage using coveralls.io
For most people, the following will do the trick:

```bash
  $ cd hi_score
  $ npm install
  $ npm run coveralls
```

And then point your browser to the hi_score [coverage page][10].

### Coverage using local reporting (Ubuntu family)
Local coverage is handy and provides most of the same details as coveralls.
However it is not as cross-platform friendly. The following steps work for
the Ubuntu family of Linux distributions. Other OSs will require
modifications. Contributions for detailed instructions for other platforms are
welcome!

```bash
$ sudo apt-get install lcov # first time only
$ cd hi_score
$ npm run coverage
$ cd coverage
$ google-chrome index.html
```

### Coverage reference
Below are the steps I used to get coverage working.
Many thanks to Elliot Stokes who's [blog post][10] provided most of the
information.

#### 1. Install lcov

```bash
$ sudo apt-get install lcov # first time only
```

#### 2. Install jscoverage

```bash
$ cd hi_score
$ npm install jscoverage --save-dev
```

#### 3. Prepare the coverage directory

```bash
  $ cd hi_score
  $ mkdir coverage
  $ cat 'coverage' >> .gitignore
  $ cat 'js-cov'   >> .gitignore
```

#### 4. Run the coverage tool

The coverage instrumentation tool creates an alternate library which we will
just told `git` to ignore by adjusting the `.gitignore` file.

```bash
  $ cd hi_score
  $ node_modules/.bin/jscoverage js; # This creates js-cov
```

#### 5. Modify the test for coverage

We need to adjust our tests to recognize the `DO_COV` environment variable and to use
   the instrumented library on demand.

```js
  root_dir = process.env.DO_COV ? '../js-cov/' : '../js/',
  ....
  require( root_dir + 'xhi.js'      );
  require( root_dir + 'xhi.util.js' );
```

#### 6. Create the coverage data

We regenerate the coverage library on each run to ensure our code is properly
instrumented.  We then output in `lcov` format for consumption by our report
generator.

```bash
  $ cd hi_score
  $ node_modules/.bin/jscoverage js \
  $  && DO_COV=1 node_modules/.bin/nodeunit --reporter=lcov \
  $  test/nu_xhi.util.js > coverage/out.da
```

#### 7. Create the local report

While `jscoverage` does provide for html output using `--reporter=html`  I found the results to be problematic (it reported failures where there were none).
It is good practice to run local coverage reporting before publishing to
coveralls.io.

```bash
  $ cd hi_score
  $ genhtml coverage/out.da -o coverage
  $ cd coverage
  $ google-chrome index.html
```


#### 8. Integrate to coveralls.io

Sign in to `https://coveralls.io` using your GitHub account.  Add the desired
repo by selecting from the list of shown at `https://coveralls.io/repos/new`.
Once you've added a repo, you may then get the token from the detail page,
as shown in `https://coveralls.io/github/mmikowski/hi_score` at the TR. 
Place this token in the `.coveralls.yaml` file.  This is **your** token.  As I
understand it, this should always be kept private, so we add the configuration
file with this information to the `.gitignore` file.

```bash
  $ cd hi_score
  $ cat .coveralls.yaml >> .gitignore
  $ cat 'repo_token: ---------your-token-here---------` > .coveralls.yaml
```

Running `npm coveralls` will now publish to coveralls.io.  The detailed
command is as follows:

```bash
  $ cd hi_score
  $ npm install coveralls
  $ # Regenerate js-cov
  $ node_modules/.bin/jscoverage js \
  $ # Generate coverage report
  $   && DO_COV=1 node_modules/.bin/nodeunit --reporter=lcov test/nu_xhi.util.js \
  $ # Pipe to coveralls module
  $   | node_modules/.bin/coveralls
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

### Version 0.3.x (current)
- (x) Add code coverage 
- (x) Replace `getDeepMapVal` and `setDeepMapVal` with much more powerful
  and tested `getStructData` and `setStructData` which empowers you with
  transversal and creation of arbitrary mixed list and map structures.
- More sophisticated sample application

## Similar Projects
[absurd.js][12], [responsive.js][13]

## Contribute!
If you want to help out, like all npm modules this is hosted on
GitHub. Any improvements or suggestions are welcome, especially when presented
with a pull request :).

If you want to contribute, please follow the following steps:

```bash
$ cd hi_score
$ npm install # Install development libs
$ cd .git/hooks
$ ln -s ../../bin/git-hook_pre-commit pre-commit
$ cd ../../

$ # The following should run successfully
$ npm test
$ npm run coverage

$ # you will need to set the .coveralls.yml token for this:
$ npm run coveralls

$ # You should see regression tests run
$ git commit -a
```

You can reach me at mike[dot]mikowski[at]gmail[dotcom].

## End
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


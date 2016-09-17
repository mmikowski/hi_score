# hi\_score by Michael S. Mikowski
This is the set of libraries I use for SPA development.

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

# Testing
Partial regression tests have been added for the xhi libraries, focusing
presently on the utilities.  You can run the tests at any time like so:

```bash
  $ cd hi_score;
  $ npm install
  $ npm test
```


## Release Notes
### Copyright (c)
2016 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

### License
MIT

### Version 0.0.x
- Initial preparation

### Version 0.1.x
- Library updates

### Version 0.2.x (in progress)
- Regression and integration testing
- Working sample application

## Similar Projects
[absurd.js][11], [responsive.js][12]

## Contribute!
If you want to help out, like all npm modules this is hosted on
GitHub. Any improvements or suggestions are welcome!
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
[11]:http://absurdjs.com/
[12]:http://www.responsivejs.com/


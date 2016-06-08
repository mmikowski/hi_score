# hi\_score by Michael S. Mikowski
This is the set of libraries I use for SPA development.

## Overview
There it is again. The new *hot* SPA framework that makes our current
one obsolete.  Now we have to unlearn everything from the old and reinvest
in the new *hotness*.  Some developers have spent far more time learning
framework DSLs than pure JavaScript. Are we ready to get off that
treadmill?

[Do we really want an SPA framework?][0] If not, then **hi**\_**score**
is here to help.  Our intention is to provide an ever improving set of
best-in-class libraries that we control, instead of having a framework
that controls us.

## Code Style
The library we have authored are written in the code style presented in
the book book **Single Page Web Applications - JavaScript end-to-end**
which is available from [Amazon][1] and directly from [Manning][2].
All of them pass JSLint. All object keys have an underscore prefix and
suffix like `_this_` which makes them easy targets for compression.

## The Goal
Provide an architecture guide, starter files, and best-in-class libraries
recommended for SPA development.  This environment will progress as
technology and support evolve.

Key attributes:

- Compressibility
- Flexibility
- Passes JSLint
- Testability
- Commit-hook regression and JSLint testing
- Fast, one-touch build system

## Status
I am currently updating the libraries. It is not complete.

## Third-pary libraries
- [jQuery][0] DOM manipulation
- [PowerCSS][1] JS-powered CSS
- [jQuery Plugin: event.gevent][2] Global events
- [jQuery Plugin: event.ue][3] Touch and desktop gestures
- [jQuery Plugin: event.dragscroll][4] Inertia scroll
- [jQuery Plugin: urianchor][5] SPA routing

jquery.debounce-1.1.min.js  jquery.event.ue-1.2.5.js

## Compatibility
Our baseline compatibility is IE9+.

## Release Notes
### Copyright (c)
2016 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

### License
MIT

### Version 0.0.x
- Initial preparation

## Similar Projects
[absurd.js][4], [responsive.js][5]

## Contribute!
If you want to help out, like all npm modules this is hosted on
GitHub. Any improvements or suggestions are welcome!
You can reach me at mike[dot]mikowski[at]gmail[dotcom].

## End
[0]:http://jquery.org
[1]:http://powercss.org
[2]:https://www.npmjs.com/package/jquery.event.gevent
[3]:https://www.npmjs.com/package/jquery.event.ue
[4]:https://www.npmjs.com/package/jquery.event.dragscroll
[5]

[0]:http://mmikowski.github.io/no-frameworks
[1]:http://www.amazon.com/dp/1617290750
[2]:http://manning.com/mikowski
[3]:http://powercss.org/
[4]:http://absurdjs.com/
[5]:http://www.responsivejs.com/


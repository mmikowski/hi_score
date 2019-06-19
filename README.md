![hi_score][_0A]
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

*The UnFramework for Single Page Web Applications*

By the author of [Single Page Web Applications, JavaScript end-to-end][_00], a Dr. Dobb's [Best Book of 2014][_0f].

## Why hi\_score?
Like other Single Page Web App (SPA) frameworks, `hi_score` provides an enormous head-start in creating professional, release-ready applications. Yet it is profoundly different from most of them in almost every other way.

The hi\_score framework helps developers create, understand, and constantly improve their SPAs by using **core technologies** instead of locking them into a large and non-portable ecosystem. It uses a **zero-transpile** development environment while still providing a **rich set of capabilities** such as life-cycle management, type safety, run-time CSS, and state management. It consumes **far fewer resources** and is productive with just a text editor, a terminal, and a browser. Easy problems are easy to solve, and **hard problems are possible**.

**A framework should serve you**, not the other way around. You should be free to move your web app to other environments without complex migration away from non-portable dead-end pseudo-languages. You shouldn't be forced to rewrite / refactor / debug all your apps every time your framework releases a new version.

If your framework is making your life more complex, if your teams can't communicate because they are using competing [Towers of Babble](#towers-of-babel), perhaps its time to get them to speak the same core languages. Use `hi_score`, the **UnFramework**.

## Latest News
Versions 1.6.1-7 Updated docs, no code change

---
## Quick start

On Mac, Ubuntu Linux, or WSL please follow these steps.

- Ensure [prerequisites are met](#prerequisites)
- Enter the following commands into the terminal one at a time

```bash
  git clone git@github.com:mmikowski/hi_score.git
  cd hi_score
  bin/xhi build,dev_start
  # Press 'enter' when prompted to review TODOs

  # Now open in a browser (adjust as needed)
  google-chrome http://localhost:8080/build/latest/dist/app-tb02.html
```

This build runs [many steps](#lifecycle-dependencies), downloads thousands of assets, and runs thousands of quality checks, yet it only takes around 5 seconds on modern hardware. Subsequent builds should take less than half the time due to [dependency resolution](#lifecycle-dependencies).

We should now see the **Typebomb 2** web app in a browser and may use the developer tools to inspect the CSS, the DOM, and the JavaScript. Notice how everything is production-ready including compressed CSS class names (yes, we **were** doing this five years before Facebook). Please compare it with the [online version][_0BA] to ensure it is working correctly.

![Typebomb 2][_0B]

---
## Key benefits
- Manage the [full life cycle](#the-xhi-lifecycle-tool)
- Integrate [with NPM](#the-xhi-lifecycle-tool) using `package.json`
- Never miss a lifecycle step with [dependency resolution](#lifecycle-dependencies)
- Avoid the complexity and magic of the [Tower of Babel](#towers-of-babel)
- Develop rapidly in with only a browser, terminal, and text editor
- Create in-line HTML documents from markdown (`bin/make-doc`)
- Build multiple related applications in a single project
- Learn from a non-trivial `Typebomb 2` app


- Debug instantly using browser tools in a **zero-compile** development environment
- Get [Detailed help](#find-help) with `bin/xhi help -v`
- Use best practice reference [Style, VDG, Library, Architecture](#find-help) using `bin/xhi design`.
- Enjoy [type-safety][_05] *without* the complexities of [TypeScript][_43] or [Flow][_44]
- Use a [layered MVC arch](#find-help) with designed for testing
- Leverage the extensively used and tested [xhi library](#leverage-the-xhi-library) to guide the design of every layer of our app.
  - Extensive, highly tested utilities in `js/xhi/01_util`
  - AJAX and socket methods in `js/xhi/02_data`
  - State and logic management in `js/xhi/03_model`
  - Feature modules as shown in `js/xhi/04_litebox.js`
  - Double-buffered dynamic CSS with [PowerCSS][_11] and `js/xhi/06_css`
  - Shell design in `js/xhi/07_shell`


- Auto-installed a commit-hook (`bin/xhi install`)
- [Deploy and patch](#patches) all vendor assets (`bin/xhi setup`)
- Run all regression tests in a drop directory (`bin/xhi dev_test`)
- Serve content with `http-server` (`bin/xhi dev_start`)
- Upgrade libraries only on request (`bin/xhi dev_upgrade`)
- Run suite of static tests (ESLint, whitespace, strict, TODOs) (`bin/xhi dev_lint`)
- Report code coverage with Istanbul (`bin/xhi dev_cover`)
- Run all tests prior to commit (`bin/xhi dev_commit`)
- Build for distribution with a single command (`bin/xhi build`)

---

## The xhi lifecycle tool
The `bin/xhi` tool automates good practice for almost every conceivable stage of the SPA life cycle. Configuration for **every** stage is found in the NPM `package.json` file. **This tool provides all [NPM lifecycle scripts][_38] such as `npm test`.**

### Find help
The lifecycle stages supported by `bin/xhi` are shown below. Those marked `placeholder` are those we plan to address in future releases. We use the command `bin/xhi help all` to see the entire list as shown below.

```
  $ bin/xhi help all
    xhi>  START Stage 00 help
    xhi>  00 help        : Help on 'xhi' tool, use -v for verbose
    xhi>  01 install     : Download and install npm modules
    xhi>  02 setup       : Patch and distribute vendor npm assets
    xhi>  03 design      : Show architecture, style, and VDG docs
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
    xhi>  15 deploy      : Upload distribution        # placeholder
    xhi>  16 prod_start  : Start production server(s) # placeholder
    xhi>  17 prod_restart: Cycle production server(s) # placeholder
    xhi>  18 prod_stop   : Stop production server(s)  # placeholder
    xhi>  19 fetch_info  : Fetch feedback             # placeholder
    xhi>  20 uninstall   : Remove xhi                 # placeholder
    xhi>  END Stage 00 help
```

We use `bin/xhi design` to see the Architecture Guide, Style Guide, or Visual Design Guide (VDG). Detailed help on a stage or range of stages is shown with the `-v` flag shown below.

```
  $ bin/xhi help dev_lint -v
  xhi>  START Stage 00 help
  xhi>  08 dev_lint:
  xhi>    Check lint quality of changed JS code.
  xhi>    Files in 'vendor|node_modules' directories are ignored.
  xhi>    Four tests are performed on each file:
  xhi>      1. Check for tab characters or trailing space
  xhi>      2. Ensure 'use strict'; is employed
  xhi>      3. Run 'eslint' on each file (config in package.json)
  xhi>      4. List TODO items for developer to review and approve
  xhi>    Any failed step causes this stage to report failure.
  xhi>
  xhi>    This stage does not "short-circuit" so any and all issues are
  xhi>    shown for each run.
  xhi>
  xhi>    NPM SCRIPTS      : none.
  xhi>    SUCCESS CRITERIA : All tests complete without error
  xhi>  END   Stage 00 help
```

### Run lifecycle stages
We run a range of lifecycle steps as shown below.

```
  # Get list of stages
  $ xhi help all

  # Run desired stage-range
  $ xhi dev_cover,build
```

The `bin/xhi` tool takes a `<stage-range>` argument. Stages that are provided out-of-order are sorted before running. A number of examples are shown below.

```
  # Run a single stage
  $ xhi install

  # Run all stages between 'install' and 'dev_commit' inclusive
  $ xhi install-dev_commit

  # Run individual stages explicitly
  $ xhi update,dev_cover

  # Run a range using stage numbers
  $ xhi 0-5

  # Get help on ranges
  $ xhi help install -v
  $ xhi help install-dev_commit
  $ xhi help update,dev_cover
  $ xhi help 0-5
```

The `bin/xhi` tool will often run more than the number of stages requested. That's because many stages have dependencies as discussed in the next section.

### Lifecycle dependencies
The `bin/xhi <stage-range>` command will always run the smallest safe number of steps to complete the target <stage-range> to minimize time and resources required. For example, consider the stages that are run when we enter `bin/xhi build,dev_start` for the first time as shown below.

- **01 install**  Download all vendor assets
- **02 setup** Copy, rename, and patch vendor files. Install commit hook.
- **06 dev\_start** Configure and start an HTTP server
- **07 dev\_test** Ran all unit test suites found in `test.d`
- **08 dev\_lint** Ran all lint tests (whitespace, TODO, eslint, strict)
- **09 dev\_cover** Calculated and report coverage
- **11 build** Minimized, obfuscated, and SuperPacked three apps
- **11 build** Created a unique dist folder for each app with meta-data and build reports

After this initial run, many of these steps will not be repeated. The install and setup stages, for example, will not be needed again unless the installation changes. The code quality checks like linting will only be needed if code files change. These dependencies are resolved by `bin/xhi` as discussed below.

#### Goal dependencies
Goal dependencies are stages that are *always* run before before a target stage. For example, if we run `bin/xhi dev_commit` the `dev_lint`, and `dev_test` stages will *always* be run first to ensure the code quality is acceptable.  If either requirement fails, `bin/xhi` exits immediately (with an exit code of 1) and the target stage is not attempted. Goal dependencies are defined in `package.json.xhi_commandTable`. We don't suggest changing them without careful consideration, but you can.

#### Environment dependencies
Environment dependencies must be successfully completed in the development environment before the target stage. For example, if we run `bin/xhi dev_commit` but have not run `bin/xhi install`, the `install` stage will be run before the `dev_commit` stage. The success or failure of each stage is saved in the state file (`run/xhi_state.json`) and the next stage is run. If the `install` stage succeeds it will not be included in future steps for `dev_commit` as it will have been completed in the prior run. Environment dependencies are defined in `package.json.xhi_commandTable`. Again, we don't suggest changing them without careful consideration.

Previously completed environment dependencies may be invalidated. For example, if `bin/xhi install` or `bin/xhi upgrade` fail, the tool will mark the `install` stage as failed and the stage will be attempted again in the next invocation that requires this stage as a dependencies.

Explicitly requested stages will always run regardless of their last success status. For example, `bin/xhi dev_lint` may or may not run the `install` stage, but `bin/xhi install,dev_lint` will *always* run the `install` stage because it is explicitly listed. `bin/xhi help-dev_lint` will also run `install` since it is explicitly within the range provided (`help-dev_lint`). We reset the status by removing the `stage_status_map` from the `run/xhi_state.json` file.

### Exit status
If all the stages of a range are successfully run an exit status of `0` is returned. If any stage fails processing stops and an exit status of `1` is provided. In Bash, the return status is available in the `$?` environment variable. If we apply minor adjustments to disable terminal interaction, `bin/xhi` should be capable of integration to other tool chains.

---
## Create a new application
We create a new application by adding files as shown below.

```
hi_score/
│
├── app-<name>.html              <= Development test page
│
├── css
│   └── app-<name>/              <= CSS if needed (but consider PowerCSS)
│       └── <name>.css
├── img
│   └── app-<name>/              <= App-specific image files
│       └── <name>.<descr>.svg
└── js
    └── app-<name>/              <= Libraries (discussed below).
        └── <name>.00_root.js
```


The `Typebomb 2` app uses PowerCSS instead of an external CSS file. In addition, there are no external images as it uses embedded SVGs. Our files therefore are as shown below.

```
hi_score/
│
├── app-tb02.html              <= Development test page
│
└── js
    └── app-tb02/              <= Libraries (discussed below).
        ├── tb02.00_root.js
        ├── tb02.01_util.js
        └── ...
```

## Leverage the xhi library
`hi_score` is build from the ground-up to support **feature module** architecture. Key tenants of this architecture and the `xhi` library are shown below.

![Feature module architecture][_0C]

- All layers are order from most basic `00_root` to highest abstraction `08_app`.
- Each layer is created using a corresponding `xhi` library file.
- Data flows from the lowest layer `00_root` to the highest `08_app`.
- All method calls are made from higher levels to lower. Calls from 02_data to 01_util or 03_model to 01_util are expected. Calls from a high layer like `07_shell` to a low layer like `02_data` should be scrutinized because one *probably* be calling all intermediate layer to safe state. All method calls from a lower layer to a higher layer or across modules of the same level are not allowed.
- Use event registration to communicate changes up the stack. For example, the `03_model` may communicate an online status by publishing event data. All registered feature modules may then update their display.
- Create feature modules that contain their own isolated data and models when appropriate. This is pragmatic and recognizes the fractal nature of MVC.

The `Typebomb 2` app has files for each layer as shown below.

```
Module layers
================================================
app-tb02/tb02.00_root.js            |        ^    \
app-tb02/tb02.01_util.js          load       |     |
app-tb02/tb02.02_01_data_mock.js  order      |     |
app-tb02/tb02.02_data.js            |        |     |
app-tb02/tb02.03_model.js           |      call,    >  xhi library
app-tb02/tb02.04_utilb.js           |      init    |
app-tb02/tb02.05_css.js           events   order   |
app-tb02/tb02.06_lb.js              |        |     |
app-tb02/tb02.07_shell.js           |        |     |
app-tb02/tb02.08_app.js             v        |    /
```

All these modules claim a slice of the application name-space (`tb02`) and use `js/xhi` libraries in one of three ways:

1. Create a configured instance and use as-is
1. Create an instance and decorate
1. Use the module to guide development

More specific notes about `Typebomb 2` app are provide in `README.app-tb02.md`.  One can omit unused layers for a given app. However, for illustrative purposes, we have included all layers here. One can copy these to a new name-space to create a new app and edit from there.

```bash
  export _ns='foo'; # Name-space
  cd ~/Github/hi_score;
  cp app-tb02.html app-${_ns}.html;

  mkdir "js/app-${_ns}";
  cd "js/app-${_ns}";
  cp ../app-tb02/tb02.00_root.js          "${_ns}.00_root.js"
  cp ../app-tb02/tb02.01_util.js          "${_ns}.01_util.js"
  cp ../app-tb02/tb02.02_data.js          "${_ns}.02_data.js"
  cp ../app-tb02/tb02.03_model.js         "${_ns}.03_model.js"
  cp ../app-tb02/tb02.04_utilb.js         "${_ns}.04_utilb.js"
  cp ../app-tb02/tb02.05_02_css_base.js   "${_ns}.05_02_css_base.js"
  cp ../app-tb02/tb02.05_css.js           "${_ns}.05_css.js"
  cp ../app-tb02/tb02.07_shell.js         "${_ns}.07_shell.js"
  cp ../app-tb02/tb02.08_app.js           "${_ns}.08_app.js"
  cp ../app-tb02/tb02.08_app-build.js     "${_ns}.08_app-build.js"
  git add .

  cd ../template
  cp app-tb02.html "app-${_ns}.html"
```

There is a lot less duplicate code here than it may appear. For example, any `01_util` layer is just a singleton instance of the `js/xhi/01_util` utilities. And any model almost certainly inherits and reuses state values and methods from an instance of the `js/xhi/03_model`.

We change all references from `tb02` in these new files to our new name-space, `${_ns}`. We also create a new build manifest in `package.json` using the `xhi_11_BuildMatrix` configuration for `tb02` as a guide. Once we confirm our new app builds as expected using `bin/xhi build` (check the output in `build/latest/dist/app-${_ns}.html`) we proceed to customize it as desired.

Stay tuned for a more detailed example of this in mid-2019.

---

## Vendor assets
The `bin/xhi setup` stage patches and deploys vendor assets using the `xhi_02_SetupMatrix` configuration found in `package.json`. This field is correlated with the with the `devDependencies` map to ensure assets are properly label, patched, distributed, and ignored by Git.

Assets are copied to their destination directory with their version number appended to their names. The `.gitignore` file instructs `git` to ignore all these files as their development management is external to our project. **Every time `bin/xhi setup` is run the vendor directories are deleted and recreated**.

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

The `jQuery` name-space is changed to `xhiJQ` and the PowerCSS name-space is changed from `pcss` to `xhiCSS`. This avoids conflicts with other libraries. The naming may be updated by adjusting `bin/rename-vendor-symbols`.  When coding, please use these symbol (`xhiJQ` and `xhiCSS`) instead of their usual names (`jQuery` and `pcss`). Also, we do **not** expect the `$` symbol to represent jQuery. Rely on local mapping if we want that behavior, e.g. `(function ($) { ... }( xhiJQ ))`.

#### Node JS libraries
NodeJS libraries are **not** copied to a `vendor` directory. We may change
this if we decide to create a server distribution. The following libraries are
installed:

- [clusterjs][_34]: Server multiplexer
- [express][_36]: Minimalist Sinatra HTTP server
- [mongodb][_34]: Official mongodb node client
- [mysql2][_35]: Faster mysql interface
- [websocket][_37]: Websockets interface

#### Development JS libraries
Development libraries are used for testing a building code. They are **not**
copied to a `vendor` directory. The following libraries are installed:

- [coveralls][_18]: Code coverage reporting
- [istanbul][_19]: Code coverage
- [jsdom][_20]: DOM mock for testing
- [eslint][_21]: Linting for commit hook
- [nodeunit][_22]: Unit testing
- [node-inspector][_23]: Debugging
- [uglifycss][_24]: CSS minification
- [uglifyjs][_25]: JS minification

### Styling assets
Vendor CSS libraries are copied to the `css/vendor` directory. The following
CSS files are installed:

- [Font Awesome][_30]: Icon font CSS

### Patches
The `xhi_02_SetupMatrix.patch_matrix` directs patch application.  This capability allows us to use great tools tweaked for our needs while maintaining the upstream source. For example, we patch `uglify-js` to support object property name compression and shuffling by `superpack`. We also patch `font-awesome` CSS files to have the correct path for our environment. The `bin/xhi setup` stage applies patches *after vendor assets are copied to their directories*. The configuration for patches are in `package.json` in the `xhiPatchMatrix` map. The patches are stored in the `patch` directory. Patches can be created as follows:

```bash
cd js/vendor
cp jquery-3.4.1.js jquery-3.4.1.js.O

# Now change jquery-3.4.1.js as required

# And create the diff
cd ../..
diff -u js/vendor/jquery-3.4.1.js.O js/vendor/jquery-3.4.1.js
  > patch/jquery-3.4.1.patch
```

---
## Build
Use `bin/xhi build` or `bin/xhi make`  to build a distribution. The tool concatenates, compresses, and obfuscates and SuperPacks JavaScript and CSS. It copies only the required assets into the the distribution directory (`build/<build_id>/dist`). The result loads faster, runs faster, and typically consumes roughly 1/50th the space of the development environment.

```
  $ ## Show disk usage of all development files
  $ cd hi_score && export PATH=`pwd`/bin:$PATH;
  $ du -sh .
    148M

  $ ## Get disk usage of all distribution files
  $ xhi build && cd build/latest && du -sh .
    3.6M
```

The `bin/xhi build` stage uses uses SuperPack to analyze symbols (variable names, object properties, and labels) and replace them with shortened and shuffled keys. The shortest keys are used for the most frequently found symbols. SuperPack reports the key-to-symbol mapping and the frequency of use which makes further optimizations by pruning code easier (see `build/<build-number>/stage/<name>-sp.diag` for mapping and key use). Projects with many object properties can be compressed up to an additional 50% by SuperPack, and it hinders reverse-engineering of code.

The build process enhances security because only a tiny, curated, obfuscated portion of our code is published and sensitive data such as SCMS information, documentation, lookup-maps, and development assets are omitted. We can publish these assets elsewhere at our discretion. The distribution also reduces the dozens of HTTP calls to just a few. This too reduces load time as illustrated below.

| Attribute   | Original (%)     | Minified (%)     | SuperPack (%)    |
|-------------|-----------------:|-----------------:|-----------------:|
| Size        | 601,027 (100.0%) | 215,400 ( 35.8%) | 162,494 ( 27.1%) |
| Gzipped     | 151,716 ( 25.2%) |  62,895 ( 10.4%) |  57,275 ( 09.5%) |
| HTTP reqs   |      27 (100.0%) |       4 ( 15.4%) |       4 ( 15.4%) |
| Local ms    |     231 (100.0%) |     166 ( 71.2%) |     144 ( 62.3%) |
| Deploy Size |           121 MB |    8 MB (  6.6%) |    8 MB (  6.5%) |

The load time measurements were made using a local HTTP server. Remote devices over slow networks would have a much larger delta in favor of SuperPack.

---
## Name-spaces
Name-spaces enable us to provide a suite of web apps that share a great deal of code but have instances and data cleanly isolated. Name-spacing across JS and CSS can help one trace behaviors to the controlling code faster and with greater accuracy. We open them in the browser (`bin/xhi install && google-chrome ex*.html`) and use the developer tools to see this in practice.

When we view Example 1 (`ex01.html`) we can open the browser development tools (press `<shift>-<ctrl>-i` or `<shift>-<cmd>-i` on a Mac), type `ex01` into the JavaScript console and press `<return>` to inspect that value. We see that this single variable that contains our entire application. When we enter `ex02` we see that it is `undefined`. When we visit the Example 2 (`ex02.html`) instead we see that `ex01` is `undefined` and `ex02` contains our app code using a similar process.

We also name-space our CSS classes to avoid collisions. When we inspect the HTML of the Example 1 app we see that nearly all classes start with an `ex01-` prefix. When we inspect Example 2 tab we find the prefix is `ex02-`. As with the JavaScript name-spacing, the prefixes are hierarchical. For example, the `ex02-_lb_` class was generated for use by the `ex02-_lb_` module. During the build process selectors are shortened along with property values as long as they use the property-name structure. For example, `ex02-_shell_title_underscore_` will compress to something like `ex02-jp`.

---
## Using an upstream source
A good way to integrate the `hi_score` repository is to use it as a `git` upstream source. One may then create new application using the `hi_score` infrastructure without missing upstream improvements or bug fixes.

First create a new empty repository on Github and copy the `ssh` repository URL, which should look similar to `git@github.com:<user>/<repo_name>` and then proceed as below:

```bash
  # Create and use Github directory
  mkdir -p ~/Github && cd ~/Github

  # Set up variables - change these as needed
  _app_name='paw'
  _git_user='mmikowski'
  _repo_name='myproject'

  # Clone the empty repository
  git clone "git@github.com:${_git_user}/${_repo_name}"
  cd "${_repo_name}"

  # Create master branch
  touch "README.${_app_name}.md" # Add app specific docs here
  git add .
  git commit -m "First commit for ${_repo_name}"
  git push

  # Verify origin
  git remote -v
  # origin  git@github.com:<user>/<repo_name>.git (fetch)
  # origin  git@github.com:<user>/<repo_name>.git (push)

  # Add upstream repository
  git remote add upstream git@github.com:mmikowski/hi_score.git

  # Verify upstream
  git remote -v
  # origin    git@github.com:<user>/<repo_name>.git (fetch)
  # origin    git@github.com:<user>/<repo_name>.git (push)
  # upstream  git@github.com:mmikowski/hi_score.git (fetch)
  # upstream  git@github.com:mmikowski/hi_score.git (push)

  # Merge changes from upstream and push to origin
  git fetch -a --prune upstream
  git merge --allow-unrelated-histories upstream/master
  git push
```

One can delete all the example apps (`tb02`, `ex01`, `ex02`) from the project if they get in the way. However we recommend retaining at least `tb02` for reference because it will continue to be refined along with the `hi_score` project. One can refresh upstream at any time as shown below.

```bash
  # Refresh view of branches
  git fetch -a --prune

  # Pull latest master or dev branch
  git checkout master
  git pull

  # Create a new branch to test merge
  git checkout -b upstream-check

  # Refresh view of upstream and test merge
  git fetch -a --prune upstream
  git merge --no-commit upstream/master
```

We recommend running `bin/xhi install,setup` after any such merge.

---
## Towers of Babel
If we want to create a single page web application these days there is no shortage of help. Developers are lured into using a starter project which we will call a **Tower of Babel**. Typically these projects include a not-yet-abandoned SPA framework (maybe React, Vue, Angular, Aurelia or Ext.js) along with a static CSS compiler (like SASS or LESS or Stylus or SCSS), a run-time CSS manager (like BootStrap), a JavaScript compiler (typically Babel with JSX and Typescript and ES5.2), a build system (like Brunch or Webpack or Parcel) so on and ad-nauseum. This requires a sophisticated management server orchestrate the numerous cross-dependencies and transpiles. There are a few guarantees beside the system will be *Magic*.

Sorry Gandalf but we don't mean *Magic* in a good way. Sure, we'll be able to create that sample-TODO-application-designed-to-impress-the-CTO in record time because of the built-in-demo-on-rails. But once one moves away from the demo even a little bit, things tend to go south fast. The build path from source code to the rendered HTML + CSS + JavaScript (**HCJ**) is so complex that it's impossible for a human to trace. When it breaks - and it will - all that *Magic* becomes *Evil Curses*. That's because these **Tower of Babel** solutions have traded HTML + CSS + Javascript for a Mötley Crüe of transpiled languages that are often larger, more numerous, harder to learn, poorly documented, poorly integrated, and much easier to break.  Problems that should be easy to solve - like adding an app to share an existing app's resources - can become impossible.

`hi_score` is designed to avoid the [Tower of Babel](#towers-of-babel), automate processes **around** the **HCJ**, and help the developers continuously improve their skills and understanding on the **core technologies** of web apps. We hope you like it.

---
## Prerequisites
### Linux, Ubuntu or Debian Based
When using Ubuntu Linux 16.04+ or a derivative -- such a Linux Mint, Kubuntu, Xubuntu, Lubuntu, or similar -- simply ensure the following libraries are installed. One can simply run the attached commands one at a time to ensure all prerequisites are met.

```
  # Install required libraries
  sudo apt install build-essential git \
    libfile-slurp-perl liblist-moreutils-perl \
    net-tools \
    openssh-server pandoc pandoc-citeproc \
    unzip zip

  # Install recommended libraries
  sudo apt install apt-file htop kdiff3 \
    mysql-client mysql-server \
    meld ppa-purge sysstat vim-gtk vim-nox vim-syntax-gtk

  # Install nodejs
  curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
  sudo apt-get install -y nodejs
```

Return to [Quick Start](#quick-start)

### Linux: Other
Other Linux distributions should generally work as long as the same libraries can be installed as with Ubuntu. With Fedora 30, for example, the following should be pretty close.

```bash
  yum install gcc gcc-c++ make openssl-devel

  # Now make sure the perl libraries and node.js 10+ is installed
```

See [this guide][_06] for NodeJS package installation on other Linux distros. Here is a more [generic guide][_07] for Kubuntu and Ubuntu.

Return to the [Quick Start](#quick-start)

### Macintosh Prerequisites
We found Mac High Sierra worked after the following.

```bash
  brew install pandoc
  # See https://nodejs.org/en/download/package-manager/#macos for nodejs
```

Another path is to use Parallels or VMFusion to import the [Virtual Appliance vmx.zip][_42] file (unzip this file before use). VirtualBox also will work but does not integrate as well to OSX as it should.

### Windows 10 Prerequisites
In theory, the Windows Subsystem for Linux running an Ubuntu distro should work as with the prerequisites [listed above](#linux-ubuntu-or-debian-based). However, we haven't tested it. On may also use the virutal appliance detailed above.

Return to the [Quick Start](#quick-start)

### Virtual Appliance Prerequisites
Download the latest [latest virtual appliance][_42] to try `hi_score` by running a host in a virtual machine.  Pick the latest `ova2` image for virtual box, and the latest `vmx.zip` image for VMware or Parallels.  The login and password are `hi_score`.

![Virtual_appliance][_0E]

After signing in, change the password for safety, and upgrade the software to the latest security patches. Open a terminal and enter the following lines, waiting for each command to complete before proceeding to the next.

```bash
  sudo apt update
  sudo apt upgrade
  sudo apt dist-upgrade
  reboot
```

Return to the [Quick Start](#quick-start)

---
## Reference notes
### Browser compatibility
Our baseline compatibility is IE9+. Those supporting IE 8 have our sympathy.

### Deployment platform
The server component of **hi\_score** is designed to run on industry-standard
hardware, cloud instances like Amazon EC2, and containers. Our server platform
is Ubuntu 16.04 LTS. Later version of Ubuntu and other distributions should
work well.

### Code Style
We use the code style presented in [Single Page Web Applications - JavaScript end-to-end][_00] (see reviews on [Amazon][_02]) in the upcoming 2nd edition. The [full code standard][_04] is found in the `docs` directory.

### IDE Configuration
We provide configs for JetBrain's IDE IntelliJ or Webstorm in the repository.  Other IDEs will work fine, but we will need to manually adjust them to support the code style. The good news is we should only need to do this once per IDE and then it can be added to the repository. Contributions for VSCode, VIM, and other environments are welcome.


## Contribute
While `hi_score` is opinionated, it is also modular and designed for change. For example, the `bin/xhi` tool is easily extended by dropping a short module into the the `lib/` directory. The architecture and code style docs used by `bin/xhi` are easily edited in the `docs/` directory. Developers are encouraged to add vendor libraries and patches [as needed][_01]. Any improvements or suggestions are welcome through the [issues tracker][_29].  Pull requests are appreciated!

## Release Notes
### Copyright (c)
2016 - 2019 Michael S. Mikowski (mike[dot]mikowski[at]gmail[dotcom])

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
- (x) Updates to `xhi/01_util.js`

### Version 0.4.x
- (x) Replace `jscoverage` with much more complete and recent `istanbul`
- (x) Add `cast` routines and detail their use
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
- (x) Add links to revised code style guides
- (x) Replace `install` script with `prep-libs` (v0.6.17+)

### Version 0.7.x
- (x) Move to constructor approach to easily create multiple concurrent name-spaced apps using the common xhi core
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
- (x) Replace JSLint with ESLint for ES2015 support
- (x) Convert from `var` => `let`
- (x) Implement `bin/xhi` tool development capabilities
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
  - (x) 11 build
  - (x) 12 publish
  - (x) 13 dev\_restart
  - (x) 14 dev\_stop
- (x) Tool enhancements
  - (x) `bin/xhi setup`     : Implement env dependencies and `lib/xhi_state.json`
  - (x) `bin/xhi setup`     : Auto-create `lib/xhi_state.json` if required
  - (x) `bin/xhi build`     : Create build directory like `dist/\<build-number\>`
  - (x) `bin/xhi build`     : Link `dist/latest` to latest build
  - (x) `bin/xhi build`     : Do not auto-increment build until next commit
  - (x) `bin/xhi dev_cover` : Move to `dist/\<build-number\>` directories
- (x) Update all NPM lifecycle scripts to use `bin/xhi`
  - (x) `"help" : "bin/xhi help"`
  - (x) `"make" : "bin/xhi make"`
  - (x) `"setup": "bin/xhi setup"`
  - (x) `"test" : "bin/xhi test"`
- (x) Move build manifest to `package.json`
- (x) Implement build numbers and link last build to `latest`
- (x) Move coverage reports into build directories
- (x) Store build and env state in `lib/xhi_state.json`
- (x) Create and update virtualBox [OVA for development][_42]
- (x) Create and update Parallels [VMX][_42] image
- (x) Replace JSLint setting from per-file to config/jslint.conf
- (x) Expect browser env for js/xhi libraries
- (x) Fix `js/xhi/01_util.js::makeSeriesMap` across timezones
- (x) Update code standard
- (x) Create AMI image for deployment

### Versions 1.4.x
2017-10-10 through 2019-01-01
- (x) Add `Typebomb 2` example application
- (x) Convert build system to JavaScript using `package.json` as manifest
- (x) Enhance `js/xhi` libs and docs
- (x) Expand and enhance utility functions (`xhi/01_util.js`)
- (x) Expand doc for `bin/xhi help build`
- (x) Fix `bin/xhi dev_cover` dependency resolution
- (x) Fix `superpack` to be more reliable
- (x) Fix font path errors with patch for font-awesome CSS
- (x) Revise code standards and images
- (x) Update AMI image for deployment and add screen shot
- (x) Update README with images
- (x) Add symbol renaming to avoid conflicts
      (jQuery => xhiJQ, pcss => xhiCSS)
- (x) Replace JSLint with ESLint and `package.json` for config

### Versions 1.5.x
2019-01-01 through 2019-06-15
- (x) Add capabilities and documentation to `js/xhi/01_utils.js`
- (x) Update all libs to latest
- (x) Revised templates per latest best practice
- (x) Include event pub-sub system in the `js/xhi/03_model.js` instance.
  This provides an integrated event log system for use in regression tests

### Version 1.6.x
2019-06-16 ongoing
- (x) Significantly updated documentation.
- (x) Move `lib/xhi_state.json` to  `run/xhi_state.json`
- (x) Update quick reference, VDG, and code standard

### Backlog
- (i) Create new virtual appliance
- (i) Update tb02 libs to latest best practice (events)
- (i) Example conversion of TB2 to new app
- (i) Improve CLI presentation of `bin/xhi design` reference by searching and using platform viewers
- (i) Add CSS => PowerCSS parser
- (o) Convert SuperPack Perl to JS and use `package.json` config
- (o) Add UUID snippet from Git to build number, for example, `000025-1c002d`
- (o) Test load times using remote server
- (o) Implement `bin/xhi deploy`
- (o) Push to NPM using `bin/xhi publish`
---

## End
[_0A]:img/hi_score.png
[_0B]:doc/images/tb2-001.png
[_0BA]:https://michaelmikowski.com/typebomb/index.html
[_0C]:doc/images/architecture.png
[_0D]:doc/images/syntax.png
[_0E]:img/hi_score-appliance.png
[_0F]:http://www.drdobbs.com/joltawards/jolt-awards-the-best-books/240169070?pgno=5
[_00]:https://www.manning.com/books/single-page-web-applications
[_01]:http://mmikowski.github.io/no-frameworks
[_02]:http://www.amazon.com/dp/1617290750
[_04]:https://github.com/mmikowski/hi_score/blob/master/doc/js-code-standard.adoc
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
[_21]:https://www.npmjs.com/package/eslint
[_22]:https://www.npmjs.com/package/nodeunit
[_23]:https://www.npmjs.com/package/node-inspector
[_24]:https://www.npmjs.com/package/uglifycss
[_25]:https://www.npmjs.com/package/uglifyjs
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
[_42]:http://michaelmikowski.com/ova/
[_43]:https://www.typescriptlang.org/
[_44]:https://flow.org/en/docs/getting-started/

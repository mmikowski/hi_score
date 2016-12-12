# hi\_score Coveralls Installation
[![Coverage Status](https://coveralls.io/repos/github/mmikowski/hi_score/badge.svg?branch=master)](https://coveralls.io/github/mmikowski/hi_score?branch=master)

If you create a fork you may submit your coverage report to coveralls.io.
However, you will need to point coveralls to your own coveralls page in 
the .coveralls.yml file and then run the `covera` script to publish your 
results.

```bash
  $ cd hi_score
  $ npm run covera
```

The report page should look similar to the [master branch site][1].

# Installation
Below are the steps we used to get coverage working. Many thanks to Elliot
Stokes who's [blog post][2] provided most of the information.
Most of this work is already integrated into **hi_score**. If you wish to 
publish a coveralls report for your fork, look at step 4.

## 1. Install istanbul

```bash
  $ cd hi_score
  $ npm install istanbul --save-dev
```

## 2. Instruct git to ignore coverage directory

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
as shown in `https://coveralls.io/github/<username>/hi_score` at the TR.

Place this token in the `.coveralls.yml` file. This is **your** token. As I
understand it, this should always be kept private, so please add the 
`.coveralls.yml` file with to the `.gitignore` file:

```bash
  $ cd hi_score
  $ cat .coveralls.yml >> .gitignore
  $ cat 'repo_token: ---------your-token-here---------' > .coveralls.yml
```

Run `npm covera` to send a report to coveralls.io. The detailed
command run by this script is as follows:

```bash
  $ cd hi_score
  $ node_modules/.bin/istanbul cover -x '**/vendor/**' \
  $  node_modules/.bin/nodeunit test/xhi_level_0.js \
  $  && cat coverage/lcov.info | node_modules/.bin/coveralls
```

# End

[1]:https://coveralls.io/github/mmikowski/hi_score
[2]:http://www.vapidspace.com/coding/2014/01/31/code-coverage-metrics-with-nodeunit/


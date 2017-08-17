/*jslint node : true */
/* vim: set ft=javascript: */
// == BEGIN PUBLIC METHOD /setupFn/ ==============================
// Purpose   : Setup project using package.json as manifest.
// Example   : xhi setup
// Returns   :
//   Runs ctx_obj.catchFn on failure.
//   Runs ctx_obj.nextFn  on success.
// Throws    : none
// Steps     :
//   1. Delete all vendor directories as directed by config.
//      directories in bin, css, font, img, and js
//   2. Copy assets from node_modules to vendor directories with the
//      npm version appended to the names.
//   3. Applies any patches (uglifyjs)
//   4. Install the commit hook if git is detected
//

function setupFn () {
  var
    ctx_obj     = this,
    catch_fn    = ctx_obj.catchFn,
    command_map = ctx_obj.commandMap,
    log_fn      = ctx_obj.logFn,
    next_fn     = ctx_obj.nextFn,
    warn_fn     = ctx_obj.warnFn,

    prefix_str  = ctx_obj.makePrefixStr( command_map ),

    xhi_obj
    ;

  ctx_obj.loadLibsFn();
  xhi_obj = ctx_obj.makeXhiObj();

  log_fn( 'Begin ' + prefix_str );
  xhi_obj.flowObj.exec(
    function _02_00InitVarsFn () {
      log_fn( '  step 00: Setup start.' );
      log_fn( '  step 01: Init variables...' );
      process.chdir( ctx_obj.fqProjDirname );
      xhi_obj.checkBinListFn.call({ then_fn : this, catch_fn : catch_fn });
    },
    function _02_01ReadPkgFileFn () {
      log_fn( '  step 02: Read package file...' );
      xhi_obj.readPkgFileFn.call({ then_fn : this, catch_fn : catch_fn });
    },
    function _02_02RmVendorDirsFn () {
      log_fn( '  step 03: Remove vendor directories...' );
      xhi_obj.rmVendorDirsFn.call({ then_fn : this, catch_fn : catch_fn });
    },
    function _02_03CopyVendorFilesFn () {
      log_fn( '  step 04: Deploy vendor assets...' );
      xhi_obj.copyVendorFilesFn.call({ then_fn : this, catch_fn : catch_fn });
    },
    function _02_04PatchFilesFn () {
      log_fn( '  step 05: Apply patches...' );
      xhi_obj.patchFilesFn.call({ then_fn : this, catch_fn : catch_fn });
    },
    function _02_05CheckGitInstallFn () {
      log_fn( '  step 06: Check for git installation...' );
      xhi_obj.checkGitInstallFn.call({
        then_fn  : this,
        catch_fn : function _catch_fn () {
          process.chdir( ctx_obj.fqOrigDirname );
          warn_fn(
            '\nExiting without installing git commit hook.\n'
            + 'Please run this step again if you add git.'
          );
          log_fn( 'Success ' + prefix_str );
          next_fn();
        }
      });
    },
    function _02_06UnlinkHookFn () {
      log_fn( '  step 07: Remove prior commit hook...' );
      xhi_obj.unlinkHookFn.call({ then_fn : this, catch_fn : catch_fn });
    },
    function _02_07LinkHookFn () {
      log_fn( '  step 08: Add latest commit hook...' );
      xhi_obj.linkHookFn.call({ then_fn : this, catch_fn : catch_fn });
    },
    function _02_99FinishRunFn () {
      process.chdir( ctx_obj.fqOrigDirname );
      log_fn( 'Success ' + prefix_str );
      next_fn();
    }
  );
}
// == . END PUBLIC METHOD /setupFn/ ==============================
module.exports = setupFn;

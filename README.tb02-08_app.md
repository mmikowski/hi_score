```
DEPENDENCY ORDER, LOAD ORDER, EVENT PROPOGATION
===============================================
tb<xx>.00_root.js
    V
tb<xx>.01_util.js
    V
tb<xx>.03_model.js   <== tb<xx>.03.model.data.js
    V
tb<xx>.05.css_<feature>.js
    V
tb<xx>.06_css.js
    V
tb<xx>.07_shell.js
    V
tb<xx>.08_app.js


CALL AND INITIALIATION ORDER
============================
tb<xx>.08_app.js
    V
tb<xx>.07_shell.js
    V
tb<xx>.06_css.js 
    V
tb<xx>.05.css_<feature>.js  
    V
tb<xx>.03_model.js => tb<xx>.03.model.data.js
    V
tb<xx>.01_util.js*
    V
tb<xx>.00_root.js
```

## How to add special bombs:

### In `tb<xx>.03.model`
Adjust the `addBomb` method to add a "Big Bomb" if the following criteria 
are met:

- There are no other "Big Bomb" currently on screen
- A reasonable amount of time has passed since the last "Big Bomb"
- Other criteria as they become obvious

The `addBomb` method will request a "Big Bomb" word from `03.model.data`.
A "Big Bomb" will then be made with the following adjustments:
- The `_is_big_bomb_` shall be set to `true`

We may also set velocity and other attributes special for a "Big Bomb".  
Perhaps it moves Left-Right instead of Top-Bottom.

### In `07.shell`
The shell will show a "Big Bomb" differently when it sees
 `bomb_obj._is_big_bomb_ === true`


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

# Problems
1. Ending is a mess, no way to restart
1. Network loading required; consider
   - Team play / challenges
   - Player messaging
   - Player or team takes turns creating bombs
     while the opponent tries to detonate them.
1. Interface looks a bit dated. Update.

# Fixes
1. Remove typebomb2
1. Make type box text higher contrast.
1. Remove bottom green border on type box.
1. Provide litebox for ending for Game Over -
   Don't clear text box or anything until after
   litebox is dismissed.

# Easy enhancements
1. x Improve svg to be maybe a little softer.
1. x Fix base palette (0)
1. Show level + wave (we currently only show wave)
1. Show hand position SVG on demand
1. Change palette for each wave and/or level
1. Add more palettes
1. Provide palette selection above score

# Cool Ideas
1. Add accuracy bonus points after waves
1. "Smart bomb" option (one per level) which clears
   all bombs on-screen.
1. "Big bomb" - special, periodic bombs
1. Spliting bombs - may be useful for "Big Bomb"
1. Alternate direction bombs, sideways movement on bombs
1. Something that strongly reminds plays of hand positions -
   E.g. speed waves of qwerty poiuy asdfg ;lkjh zxcvb nm,./
   `123435 67890-=, etc.
1. Split bombs that convert into 4 bombs querty key swipes
   as in (4)
1. Split bombs might be tied together:

```
        [ bomb ]     <= 1. Player types this correctly
  ------
  [ asdf ] [ ;lkjh ] <= 2. Bomb splits
  ------
  [ **** ] [ ;lkjh ] <= 3. User types in asdf correctly
                           so the word "greys out".
  ------
  [ **** ] [ ***** ] <= 4. User types in ;lkjh correctly.
                           It also greys out.
  ------             <= 5. Both bombs now fly off or otherwise disolve.
```

# How to add special bombs:
## In 03\_model
Adjust the `addBomb` method to add a "Big Bomb" if the following criteria 
are met:

- There are no other "Big Bomb" currently on screen
- A reasonable amount of time has passed since the last "Big Bomb"
- Other criteria as they become obvious

The `addBomb` method will request a "Big Bomb" word from `03.model.data`.
A "Big Bomb" will then be made with the following adjustments:
- The `\_is\_big\_bomb\_` shall be set to `true`

We may also set velocity and other attributes special for a "Big Bomb".  
Perhaps it moves Left-Right instead of Top-Bottom.

## In 07\_shell
The shell will show a "Big Bomb" differently when it sees
`bomb\_obj.\_is\_big\_bomb\_ === true`


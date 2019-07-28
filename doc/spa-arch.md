=====================
# Architecture

## Philosophy
The `xhi` libraries are designed for loose coupling but strict call
precidence. For example the `00` library should be loaded before any other
`xhi` library, and it may not call any library with a higher precidence. The
`08_app` library, in comparison, should be loaded after all the lower
precidence libraries, but it may call any of them.  See the diagram below.

```
 <<<<< ========================== API CALLS =================================

 +---------+    +----------+                     +----------+   +--------+
 | 02_data |    | 03_model |<--------------------| 07_shell |<--| 08_app |
 |  Data   |<---|  Model   | ..... events ...))) |   Shell  |   |   App  |
 |  Fetch  |    +----------+           :         +----------+   +--------+
 +---------+      |                    :                    |
      |           |                    :      +---------+   |
      |           |                    :      | 06_lb   |   |
      |           |                    :..))) | Litebox |<--+
      |           |  +----------+      :      | Feature |   |
      v           |  | 04_utilb |<--+---------+---------+   |
 +---------+      |  | Browser  |   |  :                    |
 | 01_util |      |  |  Utils   |   |  :      +---------+   |
 |  Utils  |<-----+--+----------+   |  :      | 06_*    |   |
 +---------+                        |  ...))) | Feature |<--+
       |                            v         | Modules |   |
       v                +-------------+       +---------+   |
 +-----------+          | 05_css_*    |                     |
 | 00_root   |          | 05_css      |<--------------------+
 | namespace |          | Feature CSS |
 +-----------+          +-------------+

 ================================ DATA FLOW ============================ >>>>
```

## Events
Use model events (preferred) or callbacks to broadcast changes for pushing any
notification "up" the stack. This eliminates or minimizes cross-talk
between feature modules and maximizes reusability.

## Using js/xhi libs
Most libs provide a constructor to create a unique instance as needed. For
example, one might create multiple models like so:

```
// Each has its own state and config.

spaCoreModelObj  = xhi._03_model_._createInstance_( spa_core  );
spaVideoModelObj = xhi._03_model_._createInstance_( spa_video );

```
After instantiation, one may take the model and then add functions
and data to the instance.  Common capabilities such as event registration,
publishing, and handler deletion are all provided by the `xhi._03_model_`
instance.

==============================================================================
# Code Standard
## Code layout and comments
### General
  • Investigate third-party code like jQuery plugins before building a custom
    module - balance the cost of integration with the benefits of
    standardization and code consistency
  • Avoid embedding JavaScript code in HTML; use external libraries instead
  • Minify, obfuscate, and gzip JavaScript and CSS before release (Buildify +
    Superpack) de layout and comments

### Use white space for readability
  • Indent two spaces per code level
  • Use spaces, not tabs, to indent
  • Limit code and comment lines to a maximum of 78 characters
  • Follow a function CALL with NO space and then '('
  • Follow a function DECLARATION with ONE space and '('
  • Follow a keyword with a single space and '('. 
    Example, `if (...)` or `for ( ... ) { }`
  • Follow each `;` in a `for` statement with a space
  • Align like elements vertically to aid comprehension
  • Use single quotes to delimit string literals

### Organize your code in paragraphs
  • Organize code in paragraphs and place blank lines between them
  • Use at least one line for each statement or assignment;  mutliple
    declarations may be placed on a single line within a var statement
  • Place white space between operators and variables so that variables are
    easier to spot
  • Place white space after every comma
  • Align like operators within paragraphs
  • Indent comments the same amount as the code they explain
  • Place a semicolon at the end of every statement
  • Place braces around all statements in a control structure like for, if,
    and while

### Break lines consistently
  • Break lines before operators so one can easily view in left column
  • Indent subsequent lines of the statement one level
  • Break lines after commas separators
  • If no closing bracket or parenthesis put semicolon on own line

### Use K&R style bracketing
  • Place the opening parenthesis, brace or bracket at the end of opening line
  • Indent code inside the delimiters (paren, brace, or bracket) one level
  • Place the closing paren, brace, or bracket on its own line with the same
    indent level as the opening line

### Comment strategically
  • Align comments to the same level as the code they explain
  • Comment frugally and apply comments to paragraph blocks
  • Non-trivial functions should explain the purpose of the function,
    what arguments it uses, what settings it uses, what it returns,
    and any exceptions it throws
  • If you disable code, explain why with a comment of the following format:
    // TODO <YYYY-MM-DD> <username> <urgency> : <comment>

### Document function APIs in-place
  ```
  // BEGIN DOM Method /toggleSlider/
  // Summary   : toggleSlider( <boolean>, [ <callback_fn> ] )
  // Purpose   : Extends and retracts chat slider
  // Example   : toggleSlider( true );
  // Arguments : (positional)
  //   0: do_extend (boolean, required).
  //      A truthy value extends slider.
  //      A falsey value retracts it.
  //   1: callback_fn (function, optional).
  //      A function that will be executed
  //      after animation is complete
  // Settings  :
  //   * chat_extend_ms, chat_retract_ms
  //   * chat_extend_ht_px, chat_retract_ht_px
  // Returns   : boolean
  //   * true  - slider animation successfully initiated
  //   * false - slider animation not initiated
  // Throws    : none
  //
  function toggleSlider ( do_extend, callback_fn ) { … }
  // END DOM Method /toggleSlider/
  ```

## Variable names
### Use common characters
  • Use only a-z, A-Z, 0-9, underscore, or $
  • Do not begin a variable name with a number
### Communicate variable scope
  • Use `camelCase` when the variable is full-module scope (i.e. it can be
    accessed anywhere in a module namespace)
  • Use `snake_case` when the variable is not full-module scope (i.e. variables
    local to a function within a module namespace)
  • Make sure all module scope variables have at least two syllables so that
    the scope is clear. For example, instead of using a variable called config
    we can use the more descriptive and obviously module-scoped configMap
  • Avoid module scope variables. Instead, place static values in configMap
    or stateMap.
  • Wrap all private key names with underscores, e.g. `topSmap._is_open_`.
    This allows SuperPack to improve compression by 30-50%.

### Variable Name Convention (Indicator | Local Scope | Module scope)
#### Boolean Type
```
| _bool [generic]  | return_bool  | returnBool  |
| is_ (state)      | is_retracted | isRetracted |
| do_ (action)     | do_retract   | doRetract   |
| has_ (inclusion) | has_whiskers | hasWhiskers |
```

#### String Type
```
| _str  [generic] | direction_str | directionStr |
| _date           | email_date    | emailDate    |
| _html           | body_html     | bodyHtml     |
| _id             | email_id      | emailId      |
| _msg            | employee_msg  | employeeMsg  |
| _name           | employee_name | employeeName |
| _txt            | email_txt     | emailTxt     |
```

#### Integer Type
```
| _int [generic]       | size_int       | SizeInt
| _count               | user_count     | userCount
| _idx                 | user_idx       | userIdx
| _ms (milliseconds)   | click_delay_ms | clickDelayMs
| i, j, k (convention) | i              | -
```

#### Number Type
```
| _num [generic] | size_num   | SizeNum
| _coord         | x_coord    | xCoord
| _px            | x_px, y_px | xPx
| _ratio         | sale_ratio | saleRatio
| x,y,z          | x          |–
```
#### Regex Type
```
| _rx | match_rx | matchRx
```

#### Array Type
````
| _list [generic]     | timestamp_list | timestampList
|                     | color_list     | colorList
|                     |                |
| _table              | user_table     | userTable
| [list of lists]     | select_table   | selectTable
| [ list of objects ] |                |
```

#### Map Type
```
| _map [generic] | employee_map       | employeeMap
|                | receipt_map        | receiptMap
|                |                    |
| _matrix        | org_matrix         | orgMatrix
|  (top-level,   | top_level_matrix   | topLevelMatrix
|   complex map) | deploy_matrix      | deployMatrix
```

#### Function Type
```
| <verb><noun>_fn  | bound_fn           | boundFn
| [generic]        | curry_get_list_fn  | curryGetListFn
|                  | get_car_list_fn    | getCarListFn
|                  | fetch_car_list_fn  | fetchCarListFn
|                  | remove_car_list_fn | removeCarListFn
|                  | store_car_list_fn  | storeCarListFn
|                  | send_car_list_fn   | sendCarListFn
|                  |                    |
| <verb><noun>     | curryGetList       | Not recommended
                   | getCarList

```

#### Object Type
```
| _obj [generic]    | employee_obj   | employeeObj
|                   | receipt_obj    | receiptObj
|                   | error_obj      | errorObj
|                   |                |
| $ (jQuery object) | $header        | $Header
|                   | $area_tab_list | $areaTabList
|                   |                |
| _proto (protoype) | user_proto     | userProto
```

#### Unknown Type
```
| _data | http_data   | httpData
|       | socket_data | socketData
|       | arg_data    |
|       | data        |
```

### Function Verbs
  • Function variable names should usually start with a verb followed by a noun
    unless it is a bound function (see below)
  • Module-scoped functions should always have two syllables or more so the
     scope is clear, e.g. getRecord or emptyCacheMap
```
| Verb    | Example        | Meaning
+---------+----------------+------------------------------------
| bound   | boundFn        | A function with a bound context
|         |                | boundfn = myFn.bind({name:'fred'});
|         |                |
| curry   | curryMakeUser  | A function that returns a function
|         |                |
| delete  | deleteUserObj  | Remove data structure FROM MEMORY
|         |                |
| destroy | destroyUserObj | Implies all references removed
| remove  | removeUserObj  |
|         |                |
| empty   | emptyUserList  | Remove all entries from list/map
|         |                |
| get     | getUserObj     | Get data structure from memory
|         |                |
| make    | makeUserObj    | Create new data using input params
|         |                |
| store   | storeUserList  | Store data structure in memory
|         |                |
| update  | updateUserList | Change memory data in-place
```

### Variable declaration and assignment
  • Use alphabetical order if there is no other order.
  • Use {} or [] instead of new Object() or new Array() to create a new
    object, map, or array.
  • Avoid using new; Use the factory pattern for object constructors.
  • Use utilities like jQuery.extend to deep copy objects and arrays
  • Explicitly declare all variables first in the functional scope using a
    single var keyword (ES5) or minimal const or let keyword (ES6).
  • Use named arguments whenever requiring 3 or more arguments in a function.
  • Use one line per variable assignment.
  • Group logically related assigments into parapgraphs
  • Declare most functions like so: function doSomething ( `arg_map` ) { … }.
    Notice the space after the function name.  Named functions are easier to
    debug.
  • Wrap Immediately Invoked Function Declarations in parenthesis
  • Use jQuery for DOM manipulation

### Namespace and file layout
#### Namespace
  • Claim a single, short name (2-4 letters) for your app namespace, e.g. spa
  • Subdivide the namespace per xhi library guide, e.g. `spa._00_root_`,
    `spa._01_util_`, `spa._02_data_`

#### JavaScript files
  • Use the js/xhi/xhi-module-tmplt.js to start any JavaScript module file
  • Include third-party JavaScript files first in HTML so their functions
    may be evaluated and made ready to our application
  • Load JavaScript libs in numerical order, e.g. `spa._00_root_`
    preceeds `spa._01_util_` which precedes `spa._02_data_`.
  • Give all JavaScript files a .js suffix
  • Store all Static JavaScript files under a directory called
    js/app-${_ns} where _ns is the app namespace.

#### CSS files
  • Prefer to use PowerCSS if dynamic CSS is required
  • Use an application prefix for all classes and id's to avoid unintended interaction
    with third-party modules
  • Create class names based on controlling modules, e.g. `spa-_07_shell_box_` and
    `spa-_06_slider_box_`.
  • When using static CSS files create a file for each JS module that creates HTML.
    e.g. css/app-spa/spa.06_slider.css and css/app-spa/spa.07_shell.css
  • Use `<namespace>-_x_<descriptor>_` for state-indicator and other shared class names,
    e.g. spa-_x_select_ and spa-_x_disabled_. Define in base CSS.

### Validation
  • Always use ESLint and the commit hook and TDD tests provided by `hi_score`
  • ESlint settings are stored in package.json
  • Add nodeunit regression tests to test.d


===========================
# Visual Design Guide (VDG)
## 3    Design Principles
### 3.1 Newspaper Layout
Avoid field titles and borders in favor of color, size,
spacing, and weight to indicate meaning. Consider the following examples:

```
NO!
Title  : President announces free school day
Author : Janus Smith
Date   : 2017-04-18 16:25 EST
Content: The President of the United States today announced a school-free day
         for all students that play tuba and can sing all the songs in the musical
         “Mary Poppins.” While this seems rather arbitrary ...

YES!
                 PRESIDENT ANNOUNCES FREE SCHOOL DAY
                 ===================================
            2017-04-18 16:25 EST - Janus Smith - AP Staff
                            ------------
The President of the United States today announced a school-free day for all
students that play tuba and can sing all the songs in the musical “Mary
Poppins.” While this seems rather arbitrary ...
```

### 3.2 Power on demand
Let the user request complexity. Avoid long forms where the user is going to
leave the majority of fields blank. Instead, consider having the user add
fields one at a time. Once the user has completed a field we can show it in
read-only form, and allow them to add an additional field or edit / delete any
of the fields previously entered.

### 3.3 Canonical paths
All first-class pages (i.e. non-modal) should have unique breadcrumb paths in
the site hierarchy. All assets detail pages should have an asset id as the
final element of the breadcrumb. This provides a familiar base-line capability
for users and systems to address unique items and create relationships. It
also allows us to cleanly distinguish between Explore, View, and Edit
functions for the benefit of development and UX.

This aids the user in finding content and provides full support for all
browser history actions - like forward, back, bookmark, browser history, and
sharing functions - and eliminates the need for any custom content access
system.  This is accomplished by using associated canonical hash-tag to the
application URL.

### 3.4 Themes
Provide easy theming to support white label branding, accessibility, and user
preference.

### 3.5 Scroll indicators
These first appeared in mobile and are now being adopted across device
classes. I think these are very handy in reducing visual clutter and providing
a consistent experience regardless of their device.

### 3.6 Provide a clear focus
Clear, tightly defined goals are the key to good design. We should identify a
conceptually coherent set of functionality that we want to provide, and be
careful to avoid mission creep. A feature that tries to do too many disparate
things will end up being complex and potentially confusing to users.

Remember: the best features provide an elegant solution to a specific task
area.

### 3.7 Minimize complexity
Every control or piece of information that we add to our feature creates
additional work for users, and increases the complexity of our feature -
potentially making it more difficult and less pleasurable to use. Therefore,
only include essential controls and information in our feature interface.

When adding a new control or piece of information, always take a moment to
question whether it is necessary.

### 3.8 Use progressive disclosure
Showing every possible control all the time makes a feature harder to use,
since users have to navigate controls that are often not relevant. Instead,
only show controls when they are needed. This makes features simpler to use,
even if the same amount of functionality is provided.

There are various ways to progressively disclose controls, from using
different views or modes, to showing transient or floating controls when
particular content items are selected.

### 3.9 Minimize user effort
A feature that is laborious to use can become the source of irritation, so
strive to make our software work for our users, not the other way around.
Every time our feature requires input from users, either in the form of using
controls or providing information, we should ask whether it is possible to do
that work for them.

Try to avoid the need for a manual setup screen or assistant, and make it easy
to go back to recently used content.

### 3.10 Create a clear hierarchy
People tend to “read” an interface from left to right and top to bottom. Items
that are encountered first are seen to be dominant over those that come later.
Use this implied hierarchy to communicate which parts of our feature are most
important.

Position the most important controls towards the top-left of our windows, and
place dominant controls prior to other controls they affect. See the visual
layout guidelines for more details.

Lists should have an obvious order: Numerical, importance, or alphabetical.
Prefer Ascending Alphabetical order for lists over 5 items long.

### 3.11 Prioritize content
Features typically present content, whether it is images, text, messages or
more complex data. It is this content that our users will be interested in,
and too many controls or user interface elements will distract from the focus
of their attention.

Give content as much space as possible in our interface, by reducing the
number of controls. Don’t crowd out the primary object of interest with
secondary information.

### 3.12  Anticipate errors
People make mistakes. Anticipating these mistakes will prevent damaging
consequences, and will make our feature more pleasurable and satisfying to
use. The first line of defense here is to design our feature so that mistakes
cannot be made. Secondly, if it is possible to make a mistake, make it easy to
recover.

Automatically correct potentially invalid input, and always make it possible
to undo destructive operations.

### 3.13  Avoid interruptions
Interruptions cause frustration and annoyance, and prevent people from
focusing on what they are interested in. Design our feature so that it stays
out of the way when it is not in use, and does not surprise when it is in use.

Use notifications with restraint, always avoid spontaneously popping up
dialogs without user intent, and avoid disruptive feedback mechanisms like
message dialogs or interfaces that jump around and change while customers are
trying to use them.

### 3.14  Empower users with search
Search is a powerful mechanism that can be used to quickly find content.
Provide it whenever we present large amounts of content, whether in the form
of lists or grids. When we provide a search function, it is vital that it is
as immediate as possible, and that it returns the results that are sought by
our users.

Our designs employ a standard search location and interface. Simply typing
when focused on an area should start a search if no other keyboard controls
are present. When other keyboard controls are present, Ctrl+F should always
open a search bar in a standard location of the focused area.

### 3.15  Support keyboard and touch input
Keyboard control is very important for power users. Strive to always provide
standard keyboard controls for activating actions or moving between visual
elements. See the Controls Standards section where we maintain an inventory of
conventions.

### 3.16  Use sensible defaults
Adding a settings options often seems like a simple design fix. However, most
people will never see or use configuration options. Instead of adding options,
try to make the default behaviour of our feature work for as many people as
possible.

### 3.17  Make features recognizable
A feature name and icon are two of the most expressive things about it, so
design them in order to communicate function and identity. Make sure that
people will understand the purpose of our feature from its name. Ensure that
we have a standard, recognizable feature icon to give our feature a
distinctive visual identity. See the Icons and Artwork section for details on
selecting an icon.

### 3.18  Use emotion and humor sparingly
Used effectively, emotion and humor can lift the experience provided by our
feature, and help to develop a positive relationship with our users. Be
careful not to overuse these techniques, though - it is far more effective to
pick a small number of moments to use emotion, rather than spraying them
throughout our user interface. Be welcoming when our feature is used for the
first time. Using humor when things go wrong is another effective technique.

## 4 Visual layout
The visual layout of controls, information and content affects how easy it is
to understand our application, as well as how beautiful it is. It is important
to recognise that visual design has a strong impact on how much work is
involved in using an application - poor layout results in users having to put
in additional effort, while good layout requires less effort.

Following these visual layout guidelines will help to produce a feature that
is beautiful, easy to understand, and efficient to use.

### 4.1 Prefer the rem and em size units
Our web application body usually uses a font size of 16 visual pixels (16px).
However, this may change in various circumstances, such as when used in large-
or small- format displays. To ensure proper scaling across all displays, the
root-em-size (rem) unit for almost all measurements independent of local font
size. Use em-size (em) units based on local font size.

### 4.2 Align and space consistently
An alignment point is an imaginary vertical or horizontal line through our
window that touches the edge of one or more labels or controls in the window.
Minimize the number of these - the fewer there are, the cleaner and simpler
our layout will appear, and the easier it will be for people to understand.

Align content and controls in our layout exactly. The eye is very sensitive to
aligned and unaligned objects. If visual elements do not line up, it will be
hard for someone to scan them. Elements that do not quite line up will be
distracting.

### 4.3 Space consistently
Use the same amounts of spacing throughout. Organize related controls and
information into groups, and use spacing to differentiate them. This makes an
interface far easier to read and understand. Leave space between elements in
increments of 0.375em (6px nominal), going up as the relationship between
related elements becomes more distant.

```
Spacing Values
| mixin_key   | css      | nominal px | use
| _spc_em_00_ | .375rem  | 06px | Grouped icons
| _spc_em_01_ | .625rem  | 10px | Icon-to-label
| _spc_em_02_ | 1.125em  | 18px | Item indent, word space
| _spc_em_03_ | 1.5em    | 24px | Peer icons, sentence space
| _spc_em_04_ | 1.875em  | 30px | Between grouped icons
| _spc_em_05_ | 2.25em   | 36px | Box padding
| _spc_em_06_ | 2.625em  | 42px | Section space
```

### 4.4 Right-justify labels
If possible, right-justify labels. This will avoid large gaps between labels
and their associated controls. This type of right-justification is not
possible if we have indented controls: here left-justification should be used
instead.

### 4.5 Prioritize visual elements
Prioritize visual elements from top-to-bottom and left-to-right. This is the
direction that people from western locales tend to read an interface, so that
the items at the top-left will be encountered first. This ordering gives
interfaces a hierarchy: those components that are viewed first are perceived
to have priority over those that come after them. For this reason, we should
place dominant controls above and to the left of the controls and content that
they affect. Header bars are a key design pattern in this respect.

### 4.6 Material Design guidelines
We embrace Material Design. This introduces the concept of a z-axis into the
visual hierarchy. Top-level (more summarizing) concepts should be presented
closer (near the top of the stack) to the user by using a higher z-index,
while lower-level (details) concepts should be presented further (nearer the
bottom of the stack) from the user by using a lower z-index.

```
| Box Shadows   |
| Mixin key     | Name       | Use              | CSS
| --            | Base plane | Canvas           | --
| _shadow_00_   | near_x     | Card on canvas   | 0.500 ) 0 0 0.125rem 0rem
| _shadow_01_   | near       | Selected card    | 0.450 ) 0 0 0.1875rem 0rem
| _shadow_02_   | close      | Bar over canvas  | 0.405 ) 0 0 0.1875rem 0.0625rem
| _shadow_03_   | close_mid  | Bar controls     | 0.365 ) 0 0 0.25rem 0.0625rem
| _shadow_04_   | mid        |                  | 0.328 ) 0 0 0.3125rem 0.125rem
| _shadow_05_   | mid_far    | Header over bar  | 0.295 ) 0 0 0.375rem 0.125rem
| _shadow_06_   | far        | Header over cnvs | 0.266 ) 0 0 0.5rem 0.1875rem
| _shadow_07_   | far_remote | Modal over cnvs  | 0.239 ) 0 0 0.625rem 0.25rem
| _shadow_08_   | remote     |                  | 0.215 ) 0 0 0.75rem 0.375rem
| _shadow_09_   | xremote    |                  | 0.194 ) 0 0 1rem 0.5rem
```

4.7 Use shadows to indicate z-index
A higher z-index item over a background will present a larger, softer shadow
versus a lower z-index item which will present a smaller, crisper shadow.

4.8 Animate the source of visual elements
Visual elements that “just appear” confuse users. Instead, show their
origination to help users understand their context:

- Drop-down menus and similar should originate from the clicked visual source
- Drill-down navigation should have a “zoom-in” effect
- Back-out navigation should have a “zoom-out” effect
- Navigation elements may originate from the sides of the screen
- Avoid disassociated areas of activity unless required for workflow – use
  masks to focus user when needed

## 5 Icons, typography, and artwork
### 5.1 Use a symbol font
We recommend using the Font Awesome symbol font and then customizing this font
to provide the missing symbols using InkScape. This font provide high-quality
icons with generally accepted meanings that scale well across all displays. We
can use an SVG editor like InkScape to add or modify glyphs. Embedded SVG
should be avoided for icons although it may still be used for graphs and other
dynamic visualizations. Alternatives to Font Awesome include Typicons, Iconic,
and Foundation.

### 5.2 Use scalable graphics
Our apps are shown on small screens with over 500 dots per inch, and desktop
displays with 1/5th this density. Therefore, the use of bit-mapped graphics
will result in a “grainy” or “tiny” on high-density displays. SVG graphics and
by extension, fonts, scale smoothly across all displays. If bit-mapped
graphics must be used, please support both low- and high-density displays by
using a high-density image scaled to 50% of its true pixel size. Other
alternatives are provided by this article.

### 5.3 Avoid icon fatigue
Icons become worthless when too numerous and not reinforced.  We should try to
have a maximum of 8 icons per context. Total icon count per app should not exceed
64 (8 icons in 8 families).

### 5.4 Reinforce icon meaning
Reinforce icon meaning by striving to always show a “key” on screen by default
- although user may hide it otherwise.  For example, if the asterisk icon “*”
means “changed” and shows a dozen times within a context, we should like to
have a “* changed” key shown in a menu (LH preferred).

### 5.5 Consistently order context controls
An icon bar for control of a "context area" should be placed at the TR corner
of the context.  "Standard" actions for the context should be placed at the
right edge of the list.  A context-specific action icon should placed on the
far-left of the icon bar after the "standard" actions.  If there is only one
context specific action, there may be a single icon that represents the
action.  If there is more than one context specific action, a single gear icon
should be present. Tapping or clicking on this icon should present the action
options in a drop-down menu.  An exception may be made for frequently used
actions

### 5.6 Use standard text styles and sizes
```
| Purpose       | Size, rem  | Size | Description
| Nominal       | 1.000      | 16px | Nominal em size
| Icon 1        | 2.000      | 32px | Largest icon
| Icon 1 box h  | 2.750      | 44px | Background h
| Icon 1 box w  | 3.000      | 48px | Background w
| Icon 1 space  | 0.750      | 12px | Space btwn icon, rt label
| Icon 1 label  | 1.750      | 28px | Avoid bold, italic, and underline styles
|
| Icon 2        | 1.750      | 28px |
| Icon 2 box h  | 2.4375     | 39px |
| Icon 2 box w  | 2.625      | 42px |
| Icon 2 space  | 0.625      | 10px |
| Icon 2 label  | 1.500      | 24px |

| Icon 3        | 1.500      | 24px |
| Icon 3 box h  | 2.000      | 32px |
| Icon 3 box w  | 2.250      | 36px |
| Icon 3 space  | 0.500      | 8 px |
| Icon 3 label  | 1.250      | 20px |

| <p>           | 1.00/1.50  | 16/24px | Std para,    margin: 0 0  1rem 0
| <p> tight     | 1.00/1.25  | 16/20px | Tight space, margin: 0 0 .5rem 0
```

### 5.7 Style links and actions differently
Hyperlinks and user actions are different. Style them accordingly.

### 5.8 Underline links on hover
Hyperlinks should have a unique color and be highlighted on underline. Links
should *not* be underlined without hover, as it disrupts the eye from scanning
the page.

## 6 Color palettes
Color palettes are currently in development. Our initial goal is to complete
the default palette using mixins and PowerCSS.

### 6.1 Default palette
TBD

## 7 Writing style
### 7.1 Be terse
Our message must be quickly understood.

Keep text short and to the point. This improves speed of comprehension for the
user. It also reduces the expansion of text when translated (remember that
translated English text can expand up to 30% in some languages).

Do not shorten your text to the point of losing meaning. A three-word label
that provides clear information is better than a one-word label that is
ambiguous or vague. Try to find the fewest possible words to satisfactorily
convey the meaning of your label.

Use words, phrases, and concepts that are familiar to the people who will be
using your application, rather than terms from the underlying system. This may
mean using terms that are associated with the tasks your application supports.
For example, in medicine, the paper folder that contains patient information
is called a “chart”. Hence, a medical application might refer to a patient
record as a “chart” rather than as a “patient database record”.

Avoid repetition where possible.

### 7.2 Use modern capitalization
The recent trend in publications is to capitalize only the first word of a
headline as with a typical English sentence. All normal rules for
capitalization (such as proper nouns) still apply.

### 7.3 Use ellipses when more work is needed
Use an ellipsis (…) at the end of a label if further input or confirmation is
required from the user before the action can be carried out. For example, Save
As…, Find… or Delete….

Do not add an ellipsis to labels such as Properties or Preferences. Do not add
ellipses to external links, as these should be visually distinct already (see
Links). While these commands open windows that can incorporate further
functionality, the label does not specify an action, and therefore does not
need to communicate that further input or confirmation is required.

### 7.4 Use ellipsis on long fields
Long text that overflows its container should be visually ended with ellipses.
CSS3 should use overflow:hidden; overflow-text:ellipses;

## 8 Controls
We employ standards to ensure that application controls are consistent and
logical across across numerous contexts. By “controls” we mean user input that
is captured by our application and acted upon.

### 8.1 Support keyboard input
Strive to enable all actions with keyboard controls. A standard ctrl+key or
alt+key scheme should be used and employed consistently. Care must be taken
not to conflict with existing browser and system shortcuts.

### 8.2 Use standard keys and motions
Use well known keyboard controls like Ctrl+F, Ctrl+C, Ctrl+S if possible. If
we cannot use them directly, use a consistent varient, such as Ctrl+Alt+F or
Ctrl+Alt+C or Ctrl+Alt+S. Use standard touch gestures as well such as
swipe-left to delete and long-press to select.

### 8.3 Provide consistent search
Simply typing when focused on an area should start a search if no other
keyboard controls are present. When other keyboard controls are present,
Ctrl+F or a click or tap at the TR corner of the focus area should always
activate a context search or filter.

### 8.4 Immediately confirm user input
Any input requires immediate visual and audible feedback to confirm to the
user that their input has been received.  Visual feedback is typically in the
form of a “pressed button” or highlighted field.  Audio feedback is typically
in the form of a gentle tap or click sound.  Avoid complex sounds except for
extraordinary or unique events. Examples include rare, severe warnings or
exceptionally good news.

### 8.5 Indicate progress
Any response that takes more than a half second after user input requires more
than a button push animation and sound. Otherwise, the user is likely to
suspect that the application has stopped working and will begin “monkey
pressing” the control which could indeed overload the system.

- Less than 500ms: Button press feedback only.
- Greater than 500ms but less than 5,000ms: Spinner feedback.
- Greater than 5,000 but less than 30,000ms: Percentage complete feedback or
  progress bar
- Greater than 30,000ms: Consider asynchronous methods such as an email with a
  download attachment when the task is complete.

## 9 Sources
- Single page web applications (book)
- GNOME 3 human interface guidelines
- Google material design reference
- Mozilla color palette

## 10 End
Original content: © 2017 Michael S. Mikowski


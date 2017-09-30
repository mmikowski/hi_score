## Code standard
Please use the included [code standard][_01].

## Architecture
The `xhi` libraries are designed for loose coupling but strict call
precidence. For example the `00` library should be loaded before any
other `xhi` library, and it may not call any library with a higher
precidence. The `08_app` library, in comparison, should be loaded 
after all the lower precidence libraries, but it may call any of them.
See the diagram below.

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
       |                            |         | Modules |   |
       v                            +---------+---------+   |
 +-----------+                      |                       |
 | 00_root   |                      |     +-------------+   |
 | namespace |                      |     | 05_css_*    |   |
 +-----------+                      |     | 06_css      |<--+
                                    |     | Feature CSS |
                                    +-----+-------------+

 ================================ DATA FLOW ============================ >>>>
```
Please use events to broadcast changes from the Model to the Shell and
feature modules. This helps eliminate or minimize cross-talk between feature
modules and maximizes their reusability.

[_01]://doc/standard/js-code-standard.html

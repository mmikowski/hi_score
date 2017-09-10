## Code standard
Please use the included [code standard][_01]. A
[quick reference][_02] guide is also available. 

## Architecture
The `xhi` libraries are designed for loose coupling but strict call
precidence. For example the `00` library should be loaded before any
other `xhi` library, and it may not call any library with a higher
precidence. The `08.app` library, in comparison, should be loaded 
after all the lower precidence libraries, but it may call any of them.
See the diagram below.

```
 <<<<< ========================== API CALLS =================================

 +---------+    +----------+                     +----------+   +--------+
 | 02.data |    | 03.model |<--------------------|  Shell   |<--|  App   |
 |  Data   |<---|  Model   | ..... events ...))) | 07.shell |   | 08.app |
 |  Fetch  |    +----------+           :         +----------+   +--------+
 +---------+      |                    :                    |
      |           |                    :      +---------+   |
      |           |                    :      | 06.lb   |   |
      |           |                    :..))) | litebox |<--+
      |           |  +----------+      :      | feature |   |
      v           |  | Browser  |<--+---------+---------+   |
 +---------+      |  |  Utils   |   |  :                    |
 | 01.util |      |  | 04.utilb |   |  :      +---------+   |
 |  Utils  |<-----+--+----------+   |  :      | 06.*    |   |
 +---------+                        |  ...))) | feature |<--+
       |                            |         | modules |   |
       v                            +---------+---------+   |
 +-----------+                      |                       |
 |   00.js   |                      |     +-------------+   |
 | namespace |                      |     | 05.css_*    |   |
 +-----------+                      |     | 06.css      |<--+
                                    |     | feature css |
                                    +-----+-------------+

 ================================ DATA FLOW ============================ >>>>
```
Please use events to broadcast changes from the Model to the Shell and
feature modules. This helps eliminate or minimize cross-talk between feature
modules and maximizes their reusability.

[_01]://doc/standard/js-code-standard.pdf
[_02]://doc/standard/js-quick-ref.pdf

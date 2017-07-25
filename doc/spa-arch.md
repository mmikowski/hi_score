## Code standard
Please use the included [code standard][_04]. It is also available in [quick reference][_03] form. These are also found in the `docs` directory.

## Architecture
The `xhi` libraries are designed for loose coupling but strict call precidence. For example the `00` library should be loaded to the browser before any other `xhi` code, and it may not call any library with a higher precidence number. The `08.app` library, in comparison, should be loaded after all the lower precidence libraries, but it may call any of them:

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

Please use model events to broadcast changes to the Shell and Feature modules and we keep our feature modules isolated from each other. This make each module much easier to reuse and prevents tight coupling.


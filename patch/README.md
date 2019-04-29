Be careful with patches: jQuery uses tabs instead of spaces.
Make sure to use `diff -u <file1> <file2> > my.patch` to capture 
these tabs otherwise the patches will not work.

Also consider diff -Naur to consider entire directories.



# deptracker
Display various dependency graphs and related information of the node modules indicated in a given package json

# Installation
```
npm install deptracker
```

# Usage
```
node app.js $flag
```

Change the following line in  ```config.json``` to point to the package you want to create a dependency graph from:

```
{ "pack":"$PACKAGE_PATH" }
``` 

# Notes

 Configuring the types of dependencies

 There are 3 types of dependencies:

    production (  dependencies) 

    development ( devDependencies)

    optional    (optionalDependencies)



 The default behaviour of this tool is to output production dependencies plus optional dependencies
  
 If you want to include devDependencies, or only want production dependencies without the optional dependencies.
 You can modify the app.js in the following statement to use ls1, ls2, ls3, ls4

 var ls = require('npm-remote-ls').ls2;

 Note that the npm-remote-ls is the fork version from rperlas and not the original one.
 https://github.com/rperlas/npm-remote-ls 






# Command Line Flags & Example Outputs

*Return a unique flattened list containing the dependencies of the latest version of every module in the package.json:*
```
node app.js latest-all
```
```
All Modules
____________________
  ├─core-util-is
  ├─es6-promise
  ├─graceful-fs
  ├─inherits
  ├─isarray
  ├─mongodb-core
  ├─process-nextick-args
  ├─readable-stream
  ├─string_decoder
  ├─util-deprecate
  └─Total: 11
```

*Return a unique flatted list containing the dependencies of the indicated version of every module in the package.json:*
```
node app.js version-all
```
```
____________________
All Modules
  ├─core-util-is
  ├─es6-promise
  ├─graceful-fs
  ├─inherits
  ├─isarray
  ├─mongodb-core
  ├─readable-stream
  ├─string_decoder
  └─Total: 9
```

*Return a dependency graph of the latest version of every module in the package.json:*
```
node app.js latest-each
```
```
Module: mongodb
{
 "mongodb@2.0.48": {
  "es6-promise@2.1.1": {},
  "readable-stream@1.0.31": {
   "isarray@0.0.1": {},
   "core-util-is@1.0.1": {},
   "string_decoder@0.10.31": {},
   "inherits@2.0.1": {}
  },
  "mongodb-core@1.2.21": {
   "bson@0.4.19": {}
  }
 }
}
Total unique dependencies: 9
________________________________________
Module: sha
{
 "sha@2.0.1": {
  "graceful-fs@4.1.2": {},
  "readable-stream@2.0.4": {
   "util-deprecate@1.0.2": {},
   "isarray@0.0.1": {},
   "inherits@2.0.1": {},
   "core-util-is@1.0.1": {},
   "process-nextick-args@1.0.3": {},
   "string_decoder@0.10.31": {}
  }
 }
}
Total unique dependencies: 9
________________________________________
Total number of modules: 2
```

*Return a dependency graph of the indicated version of every module in the package.json:*
```
node app.js version-each
```
```
Module: mongodb
{
 "mongodb@2.0.48": {
  "es6-promise@2.1.1": {},
  "readable-stream@1.0.31": {
   "inherits@2.0.1": {},
   "core-util-is@1.0.1": {},
   "string_decoder@0.10.31": {},
   "isarray@0.0.1": {}
  },
  "mongodb-core@1.2.21": {
   "bson@0.4.19": {}
  }
 }
}
Total unique dependencies: 9
________________________________________
Module: sha
{
 "sha@1.2.4": {
  "graceful-fs@3.0.8": {},
  "readable-stream@1.0.33": {
   "isarray@0.0.1": {},
   "inherits@2.0.1": {},
   "core-util-is@1.0.1": {},
   "string_decoder@0.10.31": {}
  }
 }
}
Total unique dependencies: 7
________________________________________
Total number of modules: 2
```

*Return a unique flattened list of dependencies sorted by appearances based on the latest version of every module in package.json:*
```
node app.js latest-count
```
```
Formatted as ModuleName, NumberOfOccurences
string_decoder,  2,
core-util-is,  2,
inherits,  2,
readable-stream,  2,
isarray,  2,
util-deprecate,  1,
graceful-fs,  1,
process-nextick-args,  1,
es6-promise,  1,
mongodb-core,  1,
bson,  1
```

*Return a unique flattened list of dependencies sorted by appearances based on the indicated version of every module in package.json:*
```
node app.js version-count
```
```
Formatted as ModuleName, NumberOfOccurences
core-util-is,  2,
isarray,  2,
inherits,  2,
readable-stream,  2,
string_decoder,  2,
bson,  1,
graceful-fs,  1,
es6-promise,  1,
mongodb-core,  1
```

*Returns a unique flattened list containing the dependencies of the latest version of every module (where dependencies of differing versions are considered different) in the package.json.*
```
node app.js latest-nocut
```
```
All Modules
____________________
  ├─core-util-is@1.0.1
  ├─es6-promise@2.1.1
  ├─graceful-fs@4.1.2
  ├─inherits@2.0.1
  ├─isarray@0.0.1
  ├─mongodb-core@1.2.21
  ├─process-nextick-args@1.0.3
  ├─readable-stream@1.0.31
  ├─readable-stream@2.0.4
  ├─string_decoder@0.10.31
  ├─util-deprecate@1.0.2
  └─Total: 12
```

*Returns a unique flattened list containing the dependencies of the indicated version of every module (where dependencies of differing versions are considered different) in the package.json.*
```
node app.js version-nocut
```
```
All Modules
____________________
  ├─core-util-is@1.0.1
  ├─es6-promise@2.1.1
  ├─graceful-fs@4.1.2
  ├─inherits@2.0.1
  ├─isarray@0.0.1
  ├─mongodb-core@1.2.21
  ├─process-nextick-args@1.0.3
  ├─readable-stream@1.0.31
  ├─readable-stream@2.0.4
  ├─string_decoder@0.10.31
  ├─util-deprecate@1.0.2
  └─Total: 12
```

## API
To be implemented.

The following has been disabled as it was causing failure during
npm install and is not currently used:

```js
  "devDependencies": {
    "node-inspector" : "0.12.10"
  }
```

We should be able to specify the required version of Node in package.json
as shown in this stackoverflow [response][_01].  However, this doesn't work
in practice for later versions of Node and due to reasons discussed
in this [blog post][_02].  We plan to include a node version check during 
the `npm run setup` phase, and it is in the setup-wip.js script at present.


[_01]:https://stackoverflow.com/questions/29349684
[_02]:http://www.marcusoft.net/2015/03/packagejson-and-engines-and-enginestrict.html
 

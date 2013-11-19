
```javascript
var mg42 = require("./");

mg42.setMaxSockets(50);                         // Set max sockets in the HTTP pool to 50

var ev = mg42.shootMultiple({
  url              : "http://yoursite.com",
  times            : 200,                       // Do 200 requests in total
  parallelRequests : 20,                        // 20 parallel requests max
  delay            : 100,                       // 100 ms
  timeout          : 30000                      // 30 sec
});

// When we receive a status, we log it to the console
ev.on("status", function (obj) {

  // Clear the console
  process.stdout.write("\u001b[2J\u001b[0;0H");
  console.dir(obj);

});

```

MG42
====

### An HTTP machine gun

------------------------

Usage:

```javascript
"use strict";

/* jshint node:true, laxcomma:true */

var mg42  = require("./")
  , Faker = require("Faker");

mg42.setMaxSockets(50);                         // Set max sockets in the HTTP pool to 50

var ev = mg42.shootMultiple({
  url              : "http://yoursite.com",
  times            : 200,                       // Do 200 requests in total
  parallelRequests : 20,                        // 20 parallel requests max
  delay            : 100,                       // 100 ms
  timeout          : 30000                      // 30 sec,
  method           : "POST"
});

configuration.__defineGetter__("form", function () {

  return {
    name    : Faker.Name.findName(),
    email   : Faker.Internet.email(),
    message : Faker.Lorem.paragraph()
  };

});

var ev = mg42.shootMultiple(configuration);

ev.on("status", function (obj) {

  // Clear the console
  process.stdout.write("\u001b[2J\u001b[0;0H");
  console.dir(obj);

});

```

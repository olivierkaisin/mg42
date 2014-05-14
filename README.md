MG42
=============================

An HTTP benchmarking tool


### Example:

```javascript
"use strict";


var mg42  = require("./")
  , Faker = require("Faker");


mg42.setMaxSockets(50);                         // Set max sockets in the HTTP pool to 50


var configuration = {
  url              : "http://yoursite.com",
  times            : 200,                       // Do 200 requests in total
  parallelRequests : 20,                        // 20 parallel requests max
  delay            : 100,                       // 100 ms
  timeout          : 30000                      // 30 sec,
  method           : "POST"
};


// Dynamic form data that changes at every request
configuration.__defineGetter__("form", function () {
  return {
    name    : Faker.Name.findName(),
    email   : Faker.Internet.email(),
    message : Faker.Lorem.paragraph()
  };
});


var benchmark = mg42.shootMultiple(configuration);

benchmark.on("status", function (data) {
  // Clear the console
  process.stdout.write("\u001b[2J\u001b[0;0H");
  
  console.log("Active requests: %d", data.active);
  console.log("------------------------------------------");
  console.log("Average time spent: %d", data.averageTime);
  console.log("Successes: %d", data.successes);
  console.log("Connection Failures: %d", data.connFailures);
  console.log("HTTP Failures: %d", data.httpFailures);
  console.log("Timeouts: %d", data.timeouts);
});

```

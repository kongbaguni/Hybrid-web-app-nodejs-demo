const express = require("express");
const app = express();
const router = express.Router();
const path = require('path');

app.use(express.static("public"));

app.get("/", function(req,res) {
  res.sendFile(path.join(__dirname+'/index.html'));
})


app.use(express.static(__dirname + '/static'));

app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');

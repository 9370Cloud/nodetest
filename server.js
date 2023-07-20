// npm init 
const express = require('express'); //npm install express nodemon 
const app = express();
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.urlencoded({extended: true})) 

// npm install passport passport-local express express-session mysql2

app.listen(8080, function() {
    console.log('listening on 8080')
})
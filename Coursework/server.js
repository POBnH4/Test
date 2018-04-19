const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/users";
const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const USER_DOES_NOT_EXIST = 0, USER_EXISTS = 1;
const PASSWORD_VALIDITY = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,20})");
//the password must contain at least one lowercase letter,
// one uppercase letter, one digit, and be between 8 and 20 characters;

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');

var db;

MongoClient.connect(url, function(err, database) {
  if (err) throw err;
  db = database;
  app.listen(8080);
  console.log('listening....');
});

app.get('/', function(req,res) {
  res.render('index')
});


// ----- - - - - - - - - - LOGIN --- - - - - - - -- - - - --  - --

app.post('/userDetails', function(req,res) {

    db.collection('users').count({"email": req.body.email})
      .then((occurences) => {
         if(occurences >= USER_EXISTS){
           console.log(req.body.name + 'logged in');
           // login in information....
         }else{
           console.log('IN THE GAME');

         }
      });
});


//- - - -- - - -- - - - REGISTER  - - - - - - - - - - - - - -  --


// if(passwordValidity.test(req.body.password)){
//   register...
// }else{
//   alert("You password must contain at least one lowercase letter," +
//    "one uppercase letter, one digit, and be betw een 8 and 20 characters;")
// }

       app.post('/registerDetails', function (req,res){

         db.collection('users').count({"email":req.body.email})
           .then((occurences) => {
             if(occurences > USER_DOES_NOT_EXIST){
                var info = {
                  "email": req.body.email,
                  "name":req.body.name,
                  "password": req.body.password
                };

                db.collection('users').save(info, function(err, result) {
                  if (err) throw err;
                  console.log('Saved to database');
                  res.redirect('/');
                })
              }else{
                console.log("A user already exists with the email!");
                res.redirect('/');
              }
          });
        });

// - - - - - -  - -  -  SEND AN EMAIL WITH A NEW PASSWORD -   -   -   -   -   -   -


function getRandomPassword(){

  const LENGTH_OF_PASSWORD = 14;
  const CHANCE_OF_A_NUMBER = 20;
  const MAKE_THE_NUMBER_IN_HALF = 2;
  const MAKE_CHANCE_SMALLER = 4;

  var alphabet = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz"
  var numbers = "0123456789";
  var newPassword;

  //if the gate number is more than half of the password's length
  //add a random number(character) to the newPassword string;
  //else add a random lowercase/Uppercase letter to the newPassword string;
  while(true){
   newPassword = "";
   for(var i = 0; i < LENGTH_OF_PASSWORD; i++){
     var gate = Math.floor(Math.random() * CHANCE_OF_A_NUMBER);
     if(gate >= (CHANCE_OF_A_NUMBER / MAKE_THE_NUMBER_IN_HALF) + MAKE_CHANCE_SMALLER){
       var randomNumber = Math.floor(Math.random() * numbers.length);
       newPassword += numbers.charAt(randomNumber);
     }else{
       var randomLetter = Math.floor(Math.random() * alphabet.length);
       newPassword += alphabet.charAt(randomLetter);
     }
   }
   if(PASSWORD_VALIDITY.test(newPassword)){ break;}
  }
  return newPassword;
}

app.get('/forgottenPasswordDetails', function(req,res) {
  var nodemailer = require('nodemailer');
  var newPassword = getRandomPassword();
  console.log(newPassword + " the new password for the user");
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'munrospotter@yahoo.com',
      pass: 'JustinBieberFan1'
    }
  });

  var mailOptions = {
    from: 'munrospotter@yahoo.com',
    to: req.body.email,
    subject: 'MunroSpotter new password',
    text: 'Greetings, Mr/Mrs.+ ' + 'Your new password is: ' + newPassword
     // get a person's name from the database and add it after Mr/Mrs.
  }

  // db.collection('users').find("email":req.body.email).count() == USER_EXISTS){
  //   transporter.sendMail(mailOptions, function(error, info){
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       console.log('Email sent: ' + info.response);

        // var user = {}
        // var newValues = {$set: {}};
        // db.collection('users').updateOne(user,newValues, function(err,result){
        //   if(err) throw err;
        //   res.redirect('/');
        // });
});

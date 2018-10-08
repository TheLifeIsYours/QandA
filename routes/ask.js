const express = require('express');
const fs = require('fs');
const router = express.Router();

let postsJSON = JSON.parse(fs.readFileSync('./database/json/QA.json'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('ask', {
    title: 'Ask a question'
  });
});

router.post('/', (req, res, next) => {
  res.redirect('/posts');

  let name = sanitize(req.body.name);
  console.log("name: "+name);
  if(name == undefined){
    name = "Anon";
  }
  let question = sanitize(req.body.question);

  postsJSON.push({'id': newPostID(), 'q':question, 'u':name, 'a':[]});
  
  fs.writeFileSync('./database/json/QA.json', JSON.stringify(postsJSON), 'utf8');
});

module.exports = router;

function sanitize(str) {
  return String(str).replace(/&/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, ' ').replace(/nbsp;/gi,'');
}

function newPostID(){
  let newID = randString(8);
  let newIDIsUnique = true;

  for(var post in postsJSON){
    if(postsJSON[post].id == newID){
      newIDIsUnique = false;
    }
  }
  
  if(!newIDIsUnique){
    return newPostID(); 
  }

  if(newIDIsUnique){
    return newID;
  }
}

function randString(string_length) {
  var chars = "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var rndS = '';

  for (var i = 0; i < string_length; i++) {
      var rndI = Math.floor(Math.random() * chars.length);
      rndS += chars.substring(rndI, rndI + 1);
  }
  return rndS;
}
const express = require('express');
const fs = require('fs');
const router = express.Router();

let postsJSON = JSON.parse(fs.readFileSync("./database/json/QA.json"));

router.get('/', function(req, res, next) {
  res.render('posts', {
    title: 'Questions & Answers',
    posts: postsJSON
  });
});

router.post('/answer', (req, res, next) => {
  res.redirect('/');

  let id = sanitize(req.body.id);
  let name = sanitize(req.body.name);
  console.log("name: "+name);
  if(name.length <= 0){
    name = "Anon";
  }
  let answer = sanitize(req.body.answer);

  for(var post in postsJSON){
    if(postsJSON[post].id == id){
      postsJSON[post].a.push({'u':name, 'a': answer});
      fs.writeFileSync('./database/json/QA.json', JSON.stringify(postsJSON), 'utf8');
    }
  }

});

module.exports = router;

function sanitize(str) {
  return String(str).replace(/&/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, ' ').replace(/nbsp;/gi,'');
}

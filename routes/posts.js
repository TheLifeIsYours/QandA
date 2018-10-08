const express = require('express');
const fs = require('fs');
const router = express.Router();

const getJSON = (url) => {
  console.log("Got json data");
  return JSON.parse(fs.readFileSync(url));
}

const postJSON = (data, url) => {
  fs.writeFileSync(url, JSON.stringify(data), 'utf8');
  console.log("Json was posted");
}

router.get('/', function(req, res, next) {
  res.render('posts', {
    title: 'Questions & Answers',
    posts: getJSON('./database/json/QA.json')
  });
});

router.post('/answer', async (req, res, next) => {
  res.redirect('/');

  let id = sanitize(req.body.id);
  let name = sanitize(req.body.name);

  console.log("name: "+name);
  
  if(name.length <= 0){
    name = "Anon";
  }

  let answer = sanitize(req.body.answer);

  let jsonData = getJSON('./database/json/QA.json');

  for(var post in jsonData){
    if(jsonData[post].id == id){
      jsonData[post].a.push({'u':name, 'a': answer});
      postJSON(jsonData, './database/json/QA.json');
    }
  }

});

module.exports = router;

function sanitize(str) {
  return String(str).replace(/&/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, ' ').replace(/nbsp;/gi,'');
}

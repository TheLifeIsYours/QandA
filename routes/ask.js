const express = require('express');
const fs = require('fs');
const router = express.Router();

/*Routing
-------------------------------------------------------*/
router.get('/', function(req, res, next) {
  res.render('ask', {
    title: 'Ask a question'
  });
});

router.post('/', async (req, res, next) => {
  res.redirect('/posts');

  let name = req.body.name.length <= 0 ? "Anon" : sanitize(req.body.name);
  let question = sanitize(req.body.question);

  let jsonData = await getJSON('./database/json/QA.json');

  jsonData.push({'id': newPostID(), 'q':question, 'u':name, 'a':[]});

  postJSON(jsonData, './database/json/QA.json');
});

module.exports = router;

/*Functions and other code
-------------------------------------------------------*/
const getJSON = async (url) => {
  let data = await JSON.parse(fs.readFileSync(url));
  
  return new Promise((resolve, reject) => {
    isJson(data)
    .then(resolve(data)) //passes on
    .catch((error) => {
      reject(error); //passes on error messasges
    });
  });
}

const postJSON = (data, url) => {
  return new Promise((resolve, reject) => {
    isJson(data)
    .then(
      resolve(fs.writeFileSync(url, JSON.stringify(data), 'utf8'))
    )
    .catch((error) => {
      reject(error)
    });
  });
}

const isJson = (data) => {
  return new Promise((resolve, reject) => {
    data = typeof data !== 'string' ? JSON.stringify(data) : data;

    try{
      data = JSON.parse(data);
    }catch(e){
      reject(new Error("Failed to parse to JSON format, remember to check if your json format is correct"));
    }
  
    if(typeof data === "object" && data !== null){
      resolve(true);
    }

    reject(new Error("Attempted to use invalid JSON format"));
  });
}

const newPostID = async () => {
  let newIDIsUnique = true;

  let data = await getJSON('./database/json/QA.json');
  let newID = await randString(8);

  for(var post in data)
  newIDIsUnique = data[post].id == newID ? false : true;

  return newIDIsUnique ? newID : newPostID(); 
}

const randString = (string_length) => {
  const chars = "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let rndString = '';

  for (var i = 0; i < string_length; i++) {
      var rndI = Math.floor(Math.random() * chars.length);
      rndString += chars.substring(rndI, rndI + 1);
  }
  return rndString;
}

const sanitize = (str) => {
  return String(str).replace(/&/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, ' ').replace(/nbsp;/gi,'');
};
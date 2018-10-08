const express = require('express');
const fs = require('fs');
const router = express.Router();

/*Routing
-------------------------------------------------------*/
router.get('/', async (req, res, next) => {
  res.render('posts', {
    title: 'Questions & Answers',
    posts: await getJSON('./database/json/QA.json')
  });
});

router.post('/answer', async (req, res, next) => {
  res.redirect('/');

  let id = sanitize(req.body.id);
  let name = req.body.name.length <= 0 ? "Anon" : sanitize(req.body.name);
  let answer = sanitize(req.body.answer);

  let jsonData = await getJSON('./database/json/QA.json');
  
  for(let post in jsonData){
    if(jsonData[post].id == id){
      jsonData[post].a.push({'u':name, 'a': answer});
      postJSON(jsonData, './database/json/QA.json');
    }
  }
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

const sanitize = (str) => {
  return String(str).replace(/&/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, ' ').replace(/nbsp;/gi,'');
};
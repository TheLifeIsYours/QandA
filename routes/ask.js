const Firestore = require('@google-cloud/firestore');
const express = require('express');
const router = express.Router();

/*Database setup
-------------------------------------------------------*/
const firestore = new Firestore({
  projectId: 'tliyqa',
  keyFilename: './bin/firebaseCredentials.json',
});

const qaCollection = firestore.collection('QandA');

/*Routing
-------------------------------------------------------*/
router.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next()
});

router.get('/', function(req, res, next) {
  res.render('ask', {
    title: 'Ask a question'
  });
});

router.post('/', async (req, res, next) => {
  postQuestion(req.body)
  .then( res.redirect('/') )
  .catch((err) => { res.redirect(`/error?error=${err}`) });
});

module.exports = router;

/*Functions and database connection
-------------------------------------------------------*/
const postQuestion = (content) => {
  let name = content.name.length <= 0 ? "Anon" : sanitize(content.name);
  let question = sanitize(content.question);

  return new Promise((resolve, reject) => {
    qaCollection.add({a:""}).then(ref => {
      ref.set({id: `${ref.id}`, name: `${name}`, question: `${question}`, answers: []});
    })
    .then(resolve())
      .catch((err) => {
        console.Error("Error posting answer: ", err);
        reject(new Error("Error posting answer: ", err));
      });
  });
};

const sanitize = (str) => {
  return String(str).replace(/&/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, ' ').replace(/nbsp;/gi,'');
};
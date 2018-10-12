const Firestore = require('@google-cloud/firestore');
const express = require('express');
const router = express.Router();

const firestore = new Firestore({
  projectId: 'tliyqa',
  keyFilename: './bin/firebaseCredentials.json',
  timestampsInSnapshots: true
});

const qaCollection = firestore.collection('QandA');

/*Routing
-------------------------------------------------------*/
router.get('/', async (req, res, next) => {
  res.render('posts', {
    title:  'Questions & Answers',
    posts:  await getPosts()
              .then((res) => {
                return res
              })
              .catch((err) => {
                res.redirect(`/error?error=${err}`)
              })
  });
});

router.post('/answer', async (req, res, next) => {
  await postAnswer(req.body)
    .then( res.redirect(`/`) )
    .catch((err) => { res.redirect(`/error?error=${err}`) });
});

module.exports = router;



/*Functions and other code
-------------------------------------------------------*/

const getPosts = () => {
  return new Promise((resolve, reject) => {
    qaCollection.get()
      .then((snap) => {
        let posts = [];

        snap.forEach((doc) => {
          posts.push(doc.data());
        });

        resolve(posts);
      })
      .catch((err) => {
        console.Error('Error getting questions', err);
        reject(new Error('Error getting questions', err));
      });
  });
};

const postAnswer = (content) => {
  let id = sanitize(content.id);
  let name = content.name.length <= 0 ? "Anon" : sanitize(content.name);
  let answer = sanitize(content.answer);

  return new Promise((resolve, reject) => {
    qaCollection.doc(`${id}`).update('answers',
      Firestore.FieldValue.arrayUnion({
        name: `${name}`,
        answer: `${answer}`
      })
    )
    .then(resolve())
      .catch((err) => {
        console.Error("Error posting answer: ", err);
        reject(new Error("Error posting answer: ", err));
      });
  });
};

const sanitize = (str) => {
  return String(str).replace(/&/g, ' ').replace(/</g, ' ').replace(/>/g, ' ').replace(/"/g, ' ').replace(/nbsp;/gi, '');
};
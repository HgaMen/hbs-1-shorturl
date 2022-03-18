const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const urls = [
    { origin: 'www.google.com/bluuweb1', shortURL: 'hohoho1' },
    { origin: 'www.google.com/bluuweb2', shortURL: 'hohoho2' },
    { origin: 'www.google.com/bluuweb3', shortURL: 'hohoho3' },
    { origin: 'www.google.com/bluuweb4', shortURL: 'hohoho4' },
  ];
  res.render('home', { urls: urls });
});

module.exports = router;

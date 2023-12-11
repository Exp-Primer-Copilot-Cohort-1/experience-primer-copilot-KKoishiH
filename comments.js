// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Get the comments module
const comments = require('./comments');

// Set up the server
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up the comments api
app.get('/api/comments', (req, res) => {
  comments.getAll((err, comments) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    res.json(comments);
  });
});

app.post('/api/comments', (req, res) => {
  const newComment = {
    name: req.body.name,
    content: req.body.content,
    created: new Date()
  };
  comments.create(newComment, (err, newComment) => {
    if (err) {
      return res.status(500).json({ err: err.message });
    }
    res.json(newComment);
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

// Path: comments.js
// Create the comments module
const fs = require('fs');
const path = require('path');

const commentsPath = path.join(__dirname, 'comments.json');

// Get all comments
module.exports.getAll = (cb) => {
  fs.readFile(commentsPath, 'utf8', (err, file) => {
    if (err) {
      return cb(err);
    }
    const comments = JSON.parse(file);
    cb(null, comments);
  });
};

// Add a comment
module.exports.create = (newComment, cb) => {
  this.getAll((err, comments) => {
    if (err) {
      return cb(err);
    }
    comments.unshift(newComment);
    fs.writeFile(commentsPath, JSON.stringify(comments), (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, newComment);
    });
  });
};

import React
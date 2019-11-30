const express = require('express');
const server = express();
const router = express.Router();
const db = require('../data/db.js');
server.use(express.json()); //need for put and post so server can read json


// POST	/api/posts	Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
    // console.log(req);
    if (!req.body.title || !req.body.contents){
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    }
    db.insert(req.body).then(post => {
        res.status(201).json(post);
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the post to the database" });
    });
});

// POST	/api/posts/:id/comments	Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if (post.length != 0){
            if (!req.body.text)
            {
                res.status(400).json({ errorMessage: "Please provide text for the comment." });
            }
            else {
                db.insertComment({text: req.body, post_id: req.params.id}).then(comment => {
                    res.status(201).json(comment);
                })
                .catch(err => {
                    res.status(500).json({ error: "There was an error while saving the comment to the database" });
                });
            }
        }
        else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." });
    })
  });

// GET	/api/posts	Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({ error: "The posts information could not be retrieved." });
    })
  });

// GET	/api/posts/:id	Returns the post object with the specified id.
router.get('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if(post.length != 0){
            res.status(200).json(post);
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." });
    })
});

// GET	/api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if(post.length != 0){
            db.findPostComments(req.params.id)
            .then(comments => {
                res.status(200).json(comments);
            })
            .catch(err => {
                res.status(500).json({ error: "The comments information could not be retrieved." });
            })
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." });
    })
  });

// DELETE	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if(post.length != 0){
            db.remove(req.params.id)
            .then(post => {
                res.status(200).json(post);
            })
            .catch(err => {
                res.status(500).json({ error: "The post could not be removed" });
            })
        }else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." });
    })
});

// PUT	/api/posts/:id	Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/:id/comments', (req, res) => {
    db.findById(req.params.id)
    .then(post => {
        if(post.length != 0){
            if (!req.body.title || !req.body.contents){
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
            }
            db.update(req.params.id, req.body).then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                res.status(500).json({ error: "The post information could not be modified." });
            });
        }
        else{
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." });
    })
  });

module.exports = router;

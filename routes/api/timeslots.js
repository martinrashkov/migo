const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const Timeslot = require('../../models/Timeslot');
const checkObjectId = require('../../middleware/checkObjectId');

// @route    POST api/timeslots
// @desc     Create a timeslot
// @access   Private
router.post(
  '/',
  auth,
  check('postId', 'The post is invalid').notEmpty(),
  check('startTime', 'At least one starting time is required').notEmpty(),
  check('duration', 'Duration is required').notEmpty(),
  checkObjectId('postId'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.body.postId);
  
      if (!post) {
        return res.status(404).json({ msg: 'Post not found' });
      }
  
      // Check user
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      const { postId, positive, startDate, endDate, startTime, duration, day } =
        req.body;

      const newTimeslot = new Timeslot({
        postId: postId,
        positive: positive,
        startDate: startDate,
        endDate: endDate,
        startTime: startTime,
        duration: duration,
        day: day
      });

      const timeslot = await newTimeslot.save();

      res.json(timeslot);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/timeslots/one/:id
// @desc     Get timeslots by postId
// @access   Public
router.get('/one/:id', checkObjectId('id'), async (req, res) => {
  try {
    const timeslot = await Timeslot.findById(req.params.id);

    if (!timeslot) {
      return res.status(404).json({ msg: 'Timeslot not found' });
    }

    res.json(timeslot);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    GET api/timeslots/:id
// @desc     Get timeslots by postId
// @access   Public
router.get('/:id', checkObjectId('id'), async (req, res) => {
  try {
    const timeslots = await Timeslot.find({ postId: req.params.id });

    res.json(timeslots);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/timeslots/:id
// @desc     Delete a timeslot
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const timeslot = await Timeslot.findById(req.params.id);

    if (!timeslot) {
      return res.status(404).json({ msg: 'Timeslot not found' });
    }
    
    const post = await Post.findById(timeslot.postId);

    if (!post) {
      return res.status(404).json({ msg: 'Timeslot has no post' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await timeslot.remove();

    res.json({ msg: 'Timeslot removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;

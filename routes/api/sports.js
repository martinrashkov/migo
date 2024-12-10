const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');
const checkObjectId = require('../../middleware/checkObjectId');
const checkPermission = require('../../middleware/checkPermission');

const Sports = require('../../models/Sports');

// @route    PUT api/sports/add
// @desc     Create or update user sport
// @access   Private
router.post(
  '/add',
  auth,
  checkPermission('Admin'),
  check('name', 'Name is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      sport = new Sports({
        name: req.body.name
      });

      await sport.save();

      res.json({ id: sport.id });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/sports/add/all
// @desc     Create or update all user sport
// @access   Private
router.post(
  '/add/all',
  auth,
  checkPermission('Admin'),
  check('array', 'Name is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const sports = req.body.array;
      for (let index in sports) {
        sport = new Sports({
          name: sports[index]
        });

        await sport.save();
      }

      res.json({ msg: 'Success' });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/sports
// @desc     Get all sports
// @access   Public
router.get('/', async (req, res) => {
  try {
    const sports = await Sports.find();
    const map = {};
    for (let sport of sports) map[sport._id] = sport;

    res.json(map);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

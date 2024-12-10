const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const mongoose = require('mongoose');

const Meetup = require('../../models/Meetup');
const UserToMeetup = require('../../models/UserToMeetup');
const User = require('../../models/User');
const Chat = require('../../models/Chat');
const UserToChat = require('../../models/UserToChat');
const Post = require('../../models/Post');
const Timeslot = require('../../models/Timeslot');
const checkObjectId = require('../../middleware/checkObjectId');

const daysOfTheWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const days = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false
};

// @route    POST api/meetups
// @desc     Create a meetup
// @access   Private
router.post(
  '/',
  auth,
  check('sport', 'Sport id is required').notEmpty(),
  check('location', 'Location id is required').notEmpty(),
  check('name', 'Name id is required').notEmpty(),
  check('avatar', 'Avatar id is required').notEmpty(),
  check('date', 'Date is required').notEmpty(),
  check('text', 'Text is required').notEmpty(),
  checkObjectId('sport'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        chat,
        post,
        user,
        date,
        sport,
        location,
        text,
        duration,
        avatar,
        name
      } = req.body;

      const theUser = await User.findById(req.user.id).select('-password');
      if (!theUser) {
        return res.status(404).json({ msg: 'User not found' });
      }

      let timeslotId;

      if (duration !== undefined && duration !== null) {
        let newTimeslot = new Timeslot({
          postId: post,
          positive: false,
          visible: false,
          startDate: date,
          endDate: date,
          startTime: [
            new Date(date).getHours() * 60 + new Date(date).getMinutes()
          ],
          duration: duration,
          day: { ...days, [daysOfTheWeek[new Date(date).getDay()]]: true }
        });

        let timeslot = await newTimeslot.save();

        timeslotId = timeslot._id;
      }

      const users =
        req.user.id.toString() !== user.toString()
          ? [req.user.id, user]
          : [user];

      const newMeetup = new Meetup({
        chat: chat,
        post: post,
        user: req.user.id,
        postUser: user,
        date: date,
        sport: sport,
        location: location,
        text: text,
        users: users,
        avatar: theUser.avatar,
        name: theUser.name,
        timeslot: timeslotId
      });

      let meetup = await newMeetup.save();

      for (let index in users) {
        let user = users[index];

        let newUserToMeetup = new UserToMeetup({
          user: user,
          meetup: meetup._id
        });

        newUserToMeetup.save();
      }

      res.json(meetup);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/meetups
// @desc     Get my meetups
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const usertomeetup = await UserToMeetup.find({
      user: req.user.id
    });
    let meetups = [];

    for (let index in usertomeetup) {
      let currMeetup = await Meetup.findById(
        usertomeetup[index].meetup
      ).populate('user', ['avatar']);
      if (currMeetup && currMeetup !== null) meetups.push(currMeetup);
    }

    res.json(meetups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/meetups/:id
// @desc     Get meetup by ID
// @access   Private
router.get('/:id', auth, checkObjectId('id'), async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.id).populate('user', [
      'avatar'
    ]);

    if (!meetup) {
      return res.status(404).json({ msg: 'Meetup not found' });
    }

    res.json(meetup);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/meetups/:id
// @desc     Delete a meetup
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const meetup = await Meetup.findById(req.params.id);

    if (!meetup) {
      return res.status(404).json({ msg: 'Meetup not found' });
    }

    // Check user
    if (
      meetup.user.toString() !== req.user.id &&
      meetup.postUser.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete timeslot
    if (meetup.timeslot) {
      const timeslot = await Timeslot.findById(meetup.timeslot);

      if (timeslot) {
        await timeslot.remove();
      }
    }

    // Delete userToMeetup
    const usertomeetups = await UserToMeetup.find({ meetup: meetup._id });
    usertomeetups.map(async (meetup) => {
      await meetup.remove();
    });

    await meetup.remove();

    res.json({ msg: 'Meetup removed' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    PUT api/meetups/:id
// @desc     Update a meetup
// @access   Private
router.put('/:id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const meetup = await Meetup.findById(req.params.id).populate('user', ['avatar']);;

    if (!meetup) {
      return res.status(404).json({ msg: 'Meetup not found' });
    }

    // Check user
    if (
      meetup.user.toString() !== req.user.id &&
      meetup.postUser.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { date } = req.body;

    meetup.date = date;
    await meetup.save();

    res.json(meetup);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/meetups/status/:id
// @desc     Update meetup status
// @access   Private
router.put('/status/:id', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const meetup = await Meetup.findById(req.params.id).populate('user', ['avatar']);;

    if (!meetup) {
      return res.status(404).json({ msg: 'Meetup not found' });
    }

    if (req.user.id !== meetup.postUser.toString()) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { status } = req.body;

    meetup.status = status;
    await meetup.save();

    //create meetup chat
    let adminUser = await User.findById(meetup.postUser.toString()).select(
      '-password'
    );
    let admin = {
      name: adminUser.name,
      avatar: adminUser.avatar,
      id: adminUser._id
    };
    let name = meetup.text + ' - ' + new Date(meetup.date).toDateString();

    let users = [];
    const userIds = meetup.users;
    for (let index in userIds) {
      if (!mongoose.Types.ObjectId.isValid(userIds[index])) continue;
      let currUser = await User.findById(userIds[index]).select('-password');
      users.push({
        name: currUser.name,
        avatar: currUser.avatar,
        id: currUser._id
      });
    }

    if (users.length <= 1)
      return res.status(500).send('Not enough people to create a chat');

    let chat = new Chat({
      admin: admin,
      users: users,
      name: name
    });

    const chatId = chat._id;

    for (let index in userIds) {
      if (!mongoose.Types.ObjectId.isValid(userIds[index])) continue;
      let usertochat = new UserToChat({
        user: userIds[index],
        chat: chatId
      });
      await usertochat.save();
    }

    chat.save();

    meetup.chat = chatId;
    meetup.save();

    res.json(meetup);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

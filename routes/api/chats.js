const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');

const Chat = require('../../models/Chat');
const Message = require('../../models/Message');
const User = require('../../models/User');
const Meetup = require('../../models/Meetup');
const UserToChat = require('../../models/UserToChat');

const checkObjectId = require('../../middleware/checkObjectId');

// @route    GET api/chats
// @desc     Get all user chats
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const usertochat = await UserToChat.find({ user: req.user.id });
    let chats = [];

    for (let index in usertochat) {
      let currChat = await Chat.findById(usertochat[index].chat);
      if (currChat && currChat !== null) chats.push(currChat);
    }

    res.json(chats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/chats/:id
// @desc     Get user chat
// @access   Private
router.get('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const usertochat = await UserToChat.find({
      user: req.user.id,
      chat: req.params.id
    });

    if (!usertochat) {
      return res.status(404).json({ msg: 'Chat not found' });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ msg: 'Chat not found' });
    }

    res.json(chat);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/chats
// @desc     Create chat
// @access   Private
router.post(
  '/',
  [auth, check('name', 'Name is required').notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let adminUser = await User.findById(req.user.id).select('-password');
      let admin = { "name": adminUser.name, "avatar": adminUser.avatar, "id": adminUser._id };

      let users = [];
      const userIds = req.body.userIds;
      users.push(admin);
      for (let index in userIds) {
        if (!mongoose.Types.ObjectId.isValid(userIds[index])) continue;
        let currUser = await User.findById(userIds[index]).select('-password');
        users.push({ "name": currUser.name, "avatar": currUser.avatar, "id": currUser._id });
      }

      if (users.length <= 1)
        return res.status(500).send('Not enough people to create a chat');

      let chat = new Chat({
        admin: admin,
        users: users,
        name: req.body.name
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
      let usertochat = new UserToChat({
        user: adminUser._id,
        chat: chatId
      });
      await usertochat.save();

      chat.save();
      return res.json(chat);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/chats/:id
// @desc     Delete a chat
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ msg: 'Chat not found' });
    }

    // Check user
    if (chat.admin.id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Delete userToChat
    const usertochats = await UserToChat.find({ chat: chat._id });
    usertochats.map(async (chat) => {await chat.remove()});

    await chat.remove();

    res.json({ msg: 'Chat deleted' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    POST api/chats/:chatId/add/:userId
// @desc     Add user to chat
// @access   Private
router.post(
  '/:chatId/add/:userId',
  [auth, checkObjectId('chatId'), checkObjectId('userId')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ msg: 'Chat not found' });
      }

      for (let index in chat.users) {
        if (chat.users[index].id.toString() === userId) {
          return res
            .status(400)
            .json({ msg: 'User is already part of the chat' });
        }
      }

      let user = await User.findById(userId).select('-password');
      chat.users.push(user);

      await chat.save();

      let usertochat = new UserToChat({
        user: userId,
        chat: chat._id
      });

      await usertochat.save();

      return res.json(user);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/chats/:chatId/remove/:userId
// @desc     Remove a user form chat
// @access   Private
router.delete(
  '/:chatId/users/:userId',
  [auth, checkObjectId('chatId'), checkObjectId('userId')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const chat = await Chat.findById(chatId);

      if (!chat) {
        return res.status(404).json({ msg: 'Chat not found' });
      }

      // Check user
      if (chat.admin.id.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      let theIndex = null;
      for (let index in chat.users) {
        if (chat.users[index].id.toString() === userId) {
          theIndex = index;
          break;
        }
      }

      if (theIndex === null) {
        return res.status(400).json({ msg: 'User is not a part of the chat' });
      }

      chat.users.splice(theIndex, 1);

      await chat.save();

      let usertochat = await UserToChat.find({
        user: userId,
        chat: chatId
      });
      await usertochat.remove();

      res.json({ msg: 'User removed' });
    } catch (err) {
      console.error(err.message);

      res.status(500).send('Server Error');
    }
  }
);

// @route    PUT api/chats/:chatId
// @desc     See chat
// @access   Private
router.put('/:chatId', [auth, checkObjectId('chatId')], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let chat = await Chat.findById(req.params.chatId);
    if (!chat) {
      return res.status(404).json({ msg: 'Chat not found' });
    }

    const userId = req.user.id;
    for (let index in chat.users) {
      if (chat.users[index].id.toString() === userId) {
        chat.users[index].lastSeen = new Date();
        break;
      }
    }

    await chat.save();

    res.json({ msg: 'Successfully seen chat' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    PUT api/chats/:chatId
// @desc     Change chat name
// @access   Private
router.put(
  '/:chatId/name/:newName',
  [auth, checkObjectId('chatId')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let chat = await Chat.findById(req.params.chatId);
      if (!chat) {
        return res.status(404).json({ msg: 'Chat not found' });
      }

      // Check user
      if (chat.admin.id.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'User not authorized' });
      }

      chat.name = req.params.newName;

      await chat.save();

      res.json({ msg: 'Successfully changed chat name' });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

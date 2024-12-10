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
const UserToChat = require('../../models/UserToChat');

const checkObjectId = require('../../middleware/checkObjectId');

// @route    GET api/messages/from/:id
// @desc     Get all chat messages
// @access   Private
router.get('/from/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const messages = await Message.find({ to: req.params.id });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/messages/:chatId
// @desc     Send message
// @access   Private
router.post(
  '/:chatId',
  [
    auth,
    check('text', 'Text is required').notEmpty(),
    checkObjectId('chatId')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      message = new Message({
        from: req.user.id,
        to: req.params.chatId,
        text: req.body.text
      });
      await message.save();
      return res.json(message);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/messages/:id
// @desc     Delete a message
// @access   Private
router.delete('/:id', [auth, checkObjectId('id')], async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    const chat = await Chat.findById(message.to);
    if (!chat) {
      return res.status(404).json({ msg: 'Chat not found' });
    }

    // Check user
    if (
      chat.admin.id.toString() !== req.user.id &&
      message.from.toString() !== req.user.id
    ) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await message.remove();

    res.json({ msg: 'Message deleted' });
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

module.exports = router;

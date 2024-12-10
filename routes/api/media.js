const express = require('express');
const cfg = require('../../config/cfg');
const router = express.Router();
var fs = require('fs');
var path = require('path');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const idFormat = new RegExp('^[a-zA-Z0-9]+(.[a-zA-Z0-9]+)?$');

// @route    GET api/media/:id
// @desc     Get image
// @access   Private
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (idFormat.test(id)) {
    const filePath = path.join(__dirname, '..', '..', 'media', id);
    if (fs.existsSync(filePath)) {
      var filestream = fs.createReadStream(filePath);
      filestream.pipe(res);
    } else {
      res.status(404).send('Not found');
    }
  } else {
    res.status(404).send('Not found');
  }
});

// @route    POST api/media/upload
// @desc     Upload image
// @access   Private
router.post('/upload', auth, async (req, res) => {
  const { image } = req.files;

  if (!image) return res.sendStatus(400);

  const fileType = image.mimetype;
  const fileTypeArray = fileType.split('/');
  if (fileTypeArray[0] != 'image') {
    return res.sendStatus(400);
  }

  image.name = 'img' + Math.floor(Math.random() * 100000000 + 1000000);
  let filePath = path.join(__dirname, '..', '..', 'media', image.name);

  while (fs.existsSync(path)) {
    image.name = 'img' + Math.floor(Math.random() * 100000000 + 1000000);
  }

  image.mv(filePath);
  const user = await User.findById(req.user.id).select('-password');

  user.avatar = image.name;
  await user.save();
  res.sendStatus(200);
});

module.exports = router;

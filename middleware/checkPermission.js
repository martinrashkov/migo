const mongoose = require('mongoose');
// middleware to check for a valid object id
const checkPermission = (permissionType) => (req, res, next) => {
  if (req.user === null || req.user.permission === null || req.user.permission != permissionType)
    return res.status(400).json({ msg: 'User does not have permission to execute this operation' });
  next();
};

module.exports = checkPermission;

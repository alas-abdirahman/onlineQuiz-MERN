const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// TODO: Show all admins
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.send({
      message: 'show all admins',
      admins,
    });
  } catch (error) {
    return res.status(500).send(error)
  }
});

// TODO: Add a new admin
router.post('/', async (req, res) => {
  try {
    const { fullname, email, tel, username, password, status } = req.body;
    const data = { fullname, email, tel, username, password, status };
    const admin = new Admin(data);
    const newAdmin = await admin.save();
    res.send({
      message: 'new admin has been added.',
      newAdmin,
    });
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.put('/:_id', async (req, res) => {
  try {
    const { fullname, email, tel, username, password, status } = req.body;
    const admin = await Admin.findOne({ _id: req.params._id }).exec();
    if (!admin)
      return res.status(404).send({ error: "user not found!" });
    const updateAdmin = await Admin.findOneAndUpdate({ _id: req.params._id }, {
      fullname, email, tel, username, password, status
    }, { new: true }).exec();
    res.send({
      message: 'Admin updated successfully.',
      updateAdmin,
    });
  } catch (error) {
    return res.status(500).send(error)
  }

});

router.delete('/:_id', async (req, res) => {
  try {
    const admin = await Admin.findOneAndDelete({ _id: req.params._id }).exec();
    res.send({
      message: 'User deleted successfully.',
      admin
    });
  } catch (error) {
    return res.status(500).send(error);
  }

});
module.exports = router;

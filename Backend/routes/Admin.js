const express = require('express');
const router = express.Router();
var JWT = require('jsonwebtoken');

const Admin = require('../models/Admin');

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = null;
    user = await Admin.findOne({ username: username }).exec();

    if (!user) {
      return res.status(400).send({
        error: "Invalid username or pasword, please check your credentials.",
      });
    };
    if (user.status === "blocked") {
      return res.status(400).send({
        error:
          "Admin has been blocked for some issues, please contact your system admin.",
      });
    };
    if (user.password.toString() == password.toString()) {

      // const token = JWT.sign({
      //   _id: user._id,
      //   username: user.username,
      //   email: user.email,
      // });
      res.status(200).json({
        user: {
          _id: user._id,
          fullname: user.fullname,
          username: user.username,
          password: user.password,
          email: user.email,
          tel: user.tel,
          status: user.status,
        },
        error: "",
        message: "Logged successfully",
      });

      const userObject = {
        ...user,
      };
      req.user = userObject;

    } else {
      return res
        .status(400)
        .send({ error: "Invalid username or password, please try again" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});
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
      message: 'Admin deleted successfully.',
      admin
    });
  } catch (error) {
    return res.status(500).send(error);
  }

});
module.exports = router;

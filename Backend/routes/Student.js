const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// TODO: Show all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find({});
    res.send({
      message: 'show all students',
      students,
    });
  } catch (error) {
    return res.status(500).send(error)
  }
});

// TODO: Add a new student
router.post('/', async (req, res) => {
  try {
    const { id, fullname, tel, Class } = req.body;
    const data = { id, fullname, tel, Class };
    const student = new Student(data);
    const newStudent = await student.save();
    res.send({
      message: 'new student has been added.',
      newStudent,
    });
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.put('/:_id', async (req, res) => {
  try {
    const { id, fullname, tel, Class } = req.body;
    const student = await Student.findOne({ _id: req.params._id }).exec();
    if (!student)
      return res.status(404).send({ error: "student not found!" });
    const updateStudent = await Student.findOneAndUpdate({ _id: req.params._id }, {
      id, fullname, tel, Class
    }, { new: true }).exec();
    res.send({
      message: 'Student updated successfully.',
      updateStudent,
    });
  } catch (error) {
    return res.status(500).send(error)
  }

});

router.delete('/:_id', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params._id }).exec();
    res.send({
      message: 'Student deleted successfully.',
      student
    });
  } catch (error) {
    return res.status(500).send(error);
  }

});
module.exports = router;

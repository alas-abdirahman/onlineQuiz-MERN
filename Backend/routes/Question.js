const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// TODO: Show all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find({})
    .populate([
      { path: "quiz" }
    ]).exec();
    res.send({
      message: 'show all questions',
      questions,
    });
  } catch (error) {
    return res.status(500).send(error)
  }
});

// TODO: Add a new question
router.post('/', async (req, res) => {
  try {
    const { quizID, question, option1, option2, option3, option4, answer, marks } = req.body;
    const data = { quizID, question, option1, option2, option3, option4, answer, marks };
    const newQuestion = new Question(data).save();
    res.send({
      message: 'new question has been added.',
      newQuestion,
    });
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.put('/:_id', async (req, res) => {
  try {
    const newQuestion = await Question.findOne({ _id: req.params._id }).exec();
    if (!newQuestion)
      return res.status(404).send({ error: "question not found!" });
    const updateQuestion = await Question.findOneAndUpdate({ _id: req.params._id },
      req.body,
      { new: true }).exec();
    res.send({
      message: 'Question updated successfully.',
      updateQuestion,
    });
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.delete('/:_id', async (req, res) => {
  try {
    const question = await Question.findOneAndDelete({ _id: req.params._id }).exec();
    res.send({
      message: 'Question deleted successfully.',
      question
    });
  } catch (error) {
    return res.status(500).send(error);
  }

});
module.exports = router;

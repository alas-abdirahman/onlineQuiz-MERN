const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// TODO: show all the quizes
router.get('/', async (req, res) => {
  try {
    const quizes = await Quiz.find({});
    res.send({
      message: 'show all quizes',
      quizes,
    });
  } catch (error) {
    return res.status(500).send(error)
  }
});

// TODO: add a new quiz
router.post('/', (req, res) => {
  try {
    const { quizID, subject, totalQuestion, totalMarks, duration, status } = req.body;
    const quiz = new Quiz({ quizID, subject, totalQuestion, totalMarks, duration, status });
    quiz.save().then((result) => {
      res.status(201).send(result);
    });
  } catch (error) {
    return res.status(500).send(error)
  }
});

// TODO: affect questions to a new quiz depending on QuizID
router.put('/:_id', async (req, res) => {
  try {
    const { quizID, subject, totalQuestion, totalMarks, duration, status } = req.body;
    const quiz = await Quiz.findOne({ _id: req.params._id }).exec();
    if (!quiz)
      return res.status(404).send({ error: "quiz not found!" });
    const updateQuiz = await Quiz.findOneAndUpdate({ _id: req.params._id }, {
      quizID, subject, totalQuestion, totalMarks, duration, status
    }, { new: true }).exec();
    res.send({
      message: 'Quiz updated successfully.',
      updateQuiz,
    });
  } catch (error) {
    return res.status(500).send(error)
  }

});

router.delete('/:_id', async (req, res) => {
  try {
    const quiz = await Quiz.findOneAndDelete({ _id: req.params._id }).exec();
    res.send({
      message: 'Quiz deleted successfully.',
      quiz
    });
  } catch (error) {
    return res.status(500).send(error);
  }

});

module.exports = router;

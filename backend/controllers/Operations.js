const asynchandler = require('express-async-handler');
const Quiz = require('../datamodels/Quiz');
const mongoose = require('mongoose');

const createquizz = asynchandler(async (req, res) => {
    const { title, questions } = req.body;
    console.log(req.body)
    const creator = req.user.id;
    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
        res.status(400);
        throw new Error('Invalid data');
    }

    const newQuiz = new Quiz({
        title,
        creator,
        questions,
    });
    await newQuiz.save();
    if (newQuiz) {
        res.status(201).json({
            msg: 'Quizz created successfully',
        });
    }
    else {
        res.status(500)
        throw new Error('Server error');
    }
})

const getquizzlist = asynchandler(async (req, res) => {
    const quizzes = await Quiz.find({ creator: req.user.id });
    if (quizzes) {
        res.status(200).json(quizzes)
    }
    else {
        res.status(500)
        throw new Error('Server error');
    }
})

const deletequizz = asynchandler(async (req, res) => {
    const quiz = await Quiz.findOneAndDelete(req.params.id);
    if (!quiz) {
        res.status(404)
        throw new Error('Quiz not found');
    }
    if (quiz.creator.toString() !== req.user.id) {
        res.status(403)
        throw new Error('You do not have permission to delete this quiz');
    }
    if (quiz) {
        res.status(200).json({ msg: 'Quiz deleted successfully' })
    }
    else {
        res.status(500)
        throw new Error('Server error');
    }
})

const getquizz = asynchandler(async (req, res) => {
    console.log(req.params.id);
    const { id } = req.params;
        
    // Check if the provided ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Quiz ID');
    }
    const quiz = await Quiz.findById(req.params.id); // Use findById to get the document by ID

    if (!quiz) {
        res.status(404);
        throw new Error('Quiz not found');
    }

    console.log("success");
    res.status(200).json(quiz);
})

const submit=asynchandler(async(req,res)=>{
    console.log(req.params.id)
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
        res.status(404)
        throw new Error('Quiz not found');
    }

    let score = 0;
    const answers = req.body.answers.map((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        score++;
      }
      return answer;
    });

    const result = {
      score,
      answers,
    };

    console.log(result)
    res.status(200).json(result);

})
module.exports = {
    createquizz,
    getquizzlist,
    deletequizz,
    getquizz,
    submit
}
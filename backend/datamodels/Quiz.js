const mongoose = require('mongoose');
const QuestionSchema = require('./Question');

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [QuestionSchema],
});

module.exports = mongoose.model('Quiz', QuizSchema);

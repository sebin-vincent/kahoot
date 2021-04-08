const mongoose = require('mongoose');

const choiceSchema = mongoose.Schema({
    answer: { type: String, required: true },
    option: { type: Number, required: true }
});

const questionSchema = mongoose.Schema({
    questionNumber: { type: Number, default: true },
    choices: [choiceSchema],
    points: { type: Boolean, required: true },
    question: { type: String, required: true },
    time: { type: Number, default: 30, required: true },
    type: { type: String, required: true },
    correctAnswer: { type: number, required: true },
    createdOn: { type: Number, default: Date.now, required: true },
    updatedOn: { type: Number, default: Date.now, required: true },
});

const kahootSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    questions: [questionSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Kahoot = mongoose.model('kahoots', kahootSchema);

module.exports = Kahoot;
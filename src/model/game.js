const mongoose = require('mongoose');


const contestantSchema = mongoose.Schema({
    connectionId: { type: String, required: true },
    name: { type: String, required: true },
    score: { type: Number, default: 0, required: true, }

})

const gameSchema = mongoose.Schema({
    gamePin: { type: Number, required: true },
    hostConnectionId: { type: String },
    hostId: { type: mongoose.Schema.Types.ObjectId, required: true },
    kahootId: { type: mongoose.Schema.Types.ObjectId, required: true },
    currentQuestion: { type: Number, required: true },
    isCurrentQuestionActive: { type: Boolean, default: false },
    isStarted: { type: Boolean, default: false },
    contestants: [contestantSchema]
});

const Game = mongoose.model('games', gameSchema);

module.exports = Game;
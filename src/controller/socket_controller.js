const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const User = require('../model/user');
const Kahoot = require('../model/kahoot');

exports.initialize = (io) => {

    io.on('connection', (socket) => {
        console.log(`New connection established with id ${socket.id}`);

        socket.on('CREATE_GAME', async (room) => await createGame(socket, room));

        socket.on('JOIN_GAME', async (contestant) => await joinGame(io, socket, contestant));

        socket.on('START_GAME', async (gameRequest) => await startGame(io, socket, gameRequest));

        socket.on('NEXT_QUESTION', async (gamePin) => await nextQuestion(io, socket, gamePin));

        socket.on('SUBMIT_ANSWER', async (answer) => await submitAnswer(io, socket, answer));

        socket.on('disconnect', () => {
            console.log(`Connection with id ${socket.id}  has been disconected`);
        });
    });

};

const roomSchema = Joi.object().keys({
    hostId: Joi.objectId().required(),
    kahootId: Joi.objectId().required()
});

const createGame = async (socket, room) => { //Called by host

    try {
        await roomSchema.validateAsync(room);
    } catch (ex) {
        console.log(ex.details[0].message);
        socket.emit('CREATED_GAME', { status: false, message: ex.details[0].message });
        socket.disconnect();
        return;
    }

    let hostId = room.hostId;
    let kahootId = room.kahootId;

    console.log(`Request to create new game room from host ${hostId} for kahoot ${kahootId}`);

    let kahoot = await Kahoot.findOne({ _id: kahootId, createdBy: hostId });

    if (!kahoot) {
        console.log(`Kahoot not found with id ${kahootId}`);
        socket.emit('CREATED_GAME', { status: false, message: "Kahoot not found." });
        socket.disconnect();
        return;
    }

    let gamePin = generateGamePin();

    console.log(`Game room created with pin ${gamePin}`);

    const game = new Game({
        gamePin,
        hostConnectionId: socket.id,
        hostId,
        kahootId,
        currentQuestion: 1,
        isCurrentQuestionActive: false,
        isStarted: false,
        contestants: []
    });

    await game.save();

    socket.emit('CREATED_GAME', { status: true, pin: gamePin, message: '' });

}

const contestantSchema = Joi.object().keys({
    gamePin: Joi.number().required(),
    name: Joi.string().required()
});

const joinGame = async (io, socket, contestant) => {//Called by player

    try {
        contestantSchema.validateAsync(contestant);
    } catch (ex) {
        console.log(ex.details[0].message);
        socket.emit('JOINED_GAME', { status: false, message: ex.details[0].message });
        socket.disconnect();
        return;
    }

    const connectionId = socket.id;
    const gamePin = contestant.gamePin;
    const name = contestant.name;
    console.log(`Request to join game room ${gamePin} from player with id ${connectionId}`);


}

const generateGamePin = () => {
    logger.info('Generating game pin');
    return Math.floor(100000 + Math.random() * 900000);
}
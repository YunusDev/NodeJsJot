const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IdeaSchema = new Schema({

    user_id: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    details: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
    }

});

mongoose.model('ideas', IdeaSchema);
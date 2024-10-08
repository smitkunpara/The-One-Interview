const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide a question'],
    },
    answer: {
        type: String,
        required: [true, 'Please provide an answer'],
    },
    category: {
        //Technical Round, HR Round, Aptitude, General
        type: String,
        required: [true, 'Please provide a category'],
    },
    level: {
        //Beginner, Intermediate, Senior
        type: String,
        required: [true, 'Please provide a level'],
    },
    companyName: {
        //this is optional field
        type: String,
    },
    tags: {
        //this is optional field
        type: [String],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    impressions: {
        type: Number,
        default: 0,
    },
    commentscount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['unverified', 'approved', 'rejected'],
        default: 'unverified'
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
        default: null
    },
    visibility: {
        type: String,
        enum: ['all', 'community'],
        default: 'all'
    }
});

questionSchema.index({ question: 'text', answer: 'text' });
const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
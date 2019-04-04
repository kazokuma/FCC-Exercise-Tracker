//Tmeplate/structure (model of document for shortURL)
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Schema design to register users
//ExerciseSchema is a child Schema of UserSchema this childSchema needs to be before parent Schema defined
const ExerciseSchema = new Schema({
    description: String,
    duration: Number,
    date: {type: Date, default: Date.now}
});

const UserSchema = new Schema({
    _id: String,
    username: String,
    exercise: {type: [ExerciseSchema], default: []}
});

const users = mongoose.model('users', UserSchema);

module.exports = {users};
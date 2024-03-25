const mongoose = require('mongoose');

// Define user schema
const userSchema = new mongoose.Schema({
    id: String,
    username: String,
    roomName: String
});

// Define model
const User = mongoose.model('User', userSchema);
const DB = `mongodb+srv://rs1220525:123654@cluster0.jkmlqfw.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(DB).then(() => {
    console.log('Successful Connection...');
}).catch((err) => console.log(err));

async function userJoin(id, username, roomName) {
    const user = new User({ id, username, roomName });
    await user.save();
    return user;
}

// Function to get current user
async function getUser(id) {
    return await User.findOne({ id });
}

// Function to remove user when disconnecting
async function userDisconnect(id) {
    return await User.findOneAndDelete({ id:id});
}

// Function to fetch users in a room
async function fetchUsers(roomName) {
    return await User.find({ roomName:roomName });
}

module.exports = {
    userJoin,
    getUser,
    userDisconnect,
    fetchUsers
};
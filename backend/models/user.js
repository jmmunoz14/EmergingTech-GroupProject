const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        unique: 1
    },
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    usertype:{
        type: String,
        required: true,
        trim: true
    },
    password:{
        type:String,
        required: true,
        minlength:6
    }
});

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
})

module.exports = mongoose.model('User', userSchema)
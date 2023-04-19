const mongoose = require('mongoose')
import bcrypt from 'bcrypt';

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
    address:{
        type: String,
        required: true,
        trim: true
    },
    city:{
        type: String,
        required: true,
        trim: true
    },
    phone:{
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

const User=mongoose.model('User',userSchema);

export default User
const mongoose= require("mongoose");
const Schema= mongoose.Schema;

const userSchema = new Schema({
    
    username: {
    type: String,
    trim: true,
    required: [true, "Username is required!"],
    unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required!"],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address!'],
        trim: true
    },
    password: {
        type: String,
        required: true
    },
   movie: {
    type: [mongoose.Types.ObjectId],
    ref: "Movie"
   },

   Admin: {type: Boolean, default: false},
},
{
    timestamps: true
}
);

const User= mongoose.model("User", userSchema);

module.exports = User;
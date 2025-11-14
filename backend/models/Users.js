import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    refreshTokens: [{  
        token: String,
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 604800 // 
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

export default mongoose.model("User", userSchema)
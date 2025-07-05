import { model, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    _v:{
        type:Number
    }
},
{strict:"throw"}
)

const User = model("user", userSchema)
export default User;
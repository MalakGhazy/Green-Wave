import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        firstName:{
            type:String,
            lowercase:true,
            required: true,
        },
        lastName:{
            type : String,
            lowercase:true,
            required :true,
        },
        /*name : {
            type:String,
            required :[true,'Username is required'],
            min :[2,'minimum length 2 char'],
            max :[20,'max length 20 char']
        },*/
        email:{
            type:String,
            unique:[true,'email must be unique'],
            required :[true,'email is required'],
        },
        password:{
            type:String,
            required:[true,'password is required'],
        },
        phone:{
            type:String,
        },
        // Date of Birth 
        DOB:{type:Date},
        role:{
            type:String,
            default : 'User',
            enum : ['User','Admin']
        },
        points:{
            type:Number,
            default : 0

        },
        isConfirmed : {
            type:Boolean,
            default:false,
        },
        isDeleted : {
            type:Boolean,
            default:false,
        },
        /*blocked: {
            type: Boolean,
            default: false,
        },*/
        code:{
            type:String,
            min: [6, 'length must be 6'],
            max: [6, 'length must be 6']
        },
        /*active: {
        type: Boolean,
        default: false,
        },*/
    },
    {
        timestamps:true
    }
)

const userModel = mongoose.model ('User',userSchema);
export default userModel

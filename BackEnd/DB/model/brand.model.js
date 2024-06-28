import { Schema, Types, model } from "mongoose";

const brandSchema = new Schema({
    name:{type:String,required:true,unique:true,lowercase:true},
    image:{type:Object}, // Logo
    createdBy:{ type : Types.ObjectId , ref : 'User',required : true}
},{
    timestamps:true
}
)
const brandModel = model('Brand',brandSchema)

export default brandModel

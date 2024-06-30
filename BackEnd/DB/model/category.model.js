import mongoose, { Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name: {type:String,required:true,unique:true,lowercase:true},
    slug: { type: String, required: true ,unique:true,lowercase:true},
    createdBy : {type:Types.ObjectId , ref :'User',required:true}
},
{
    timestamps:true
}
)
const categoryModel = mongoose.model('Category',categorySchema)

export default categoryModel
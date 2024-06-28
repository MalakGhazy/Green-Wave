import { Schema, Types } from "mongoose";

const categorySchema = new Schema({
    name: {type:String,required:true,unique:true,lowercase:true},
    image : {type:Object},
    createdBy : {type:Types.ObjectId , ref :'User',required:true}
},
{
    timestamps:true
}
)

const categoryModel = model('Category',categorySchema)

export default categoryModel
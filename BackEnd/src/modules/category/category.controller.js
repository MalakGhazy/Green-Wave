
import slugify from "slugify"
import categoryModel from "../../../DB/model/category.model.js"
import { ErrorClass } from "../../utils/errorClass.js"
import { StatusCodes } from "http-status-codes"
import { ApiFeatures } from "../../utils/apiFeatures.js"
//1]=================Add Category=================
export const addCategory = async(req,res,next)=>{
    let{name}= req.body
    const userId=req.user._id
    const isExist = await categoryModel.findOne({name})
    if(isExist){
        return next (new ErrorClass(`Category ${name} already exists`,StatusCodes.NOT_FOUND))
    }
    const category= await categoryModel.create({
        name,
        slug:slugify(name),
        createdBy:userId
    })
    res.status(StatusCodes.CREATED).json({message:"Done",category})
}
//2]================= Update Category =================
export const updateCategory = async(req,res,next)=>{
    const{categoryId}=req.params
    const category = await categoryModel.findById(categoryId)
    if(!category){
        return next (new ErrorClass('This Category is not found',StatusCodes.NOT_FOUND))
    }
    if(req.body.name){
        if(category.name == req.body.name){
            return next (new ErrorClass('Sorry , we can not update category name with the same old name.',StatusCodes.NOT_FOUND))
        }
        if(await categoryModel.findOne({name:req.body.name}))
        {
            return next (new ErrorClass('Duplicated Category name',StatusCodes.NOT_FOUND))
        }
        category.name=req.body.name
        category.slug=slugify(req.body.name,'_')
    }
    await category.save()
    return res.status(StatusCodes.ACCEPTED).json({message:"Done",category})
}
//3]================= Delete Category ===================
export const DeleteCategory = async(req,res,next)=>{
    const {categoryId}=req.params
    const isExist = await categoryModel.findByIdAndDelete(categoryId)
    if(!isExist){
        return next (new ErrorClass('This Category is not found',StatusCodes.NOT_FOUND))
    }
    return res. status(StatusCodes.OK).json({message:"Done",isExist})
}
//4]================= Search Category ==================== 
//============should be replaced by api class =================
export const SearchByName = async(req,res,next)=>
    {
      const {searchkey}=req.query
      const categories=await categoryModel.find({
        name:{
          $regex:`${searchkey}`
        }
      })
      if(categories.length == 0)
        {
           return next (new ErrorClass('This Category is not found',StatusCodes.NOT_FOUND))
        }
        return res.status(StatusCodes.OK).json({message:"Found",categories}) 
    }
//5]================= Get Category By Id =================
export const getById = async(req,res,next) =>{
    const {categoryId}=req.params
    const isExist = await categoryModel.findById(categoryId)
    if(!isExist){
        return next (new ErrorClass('This Category is not found',StatusCodes.NOT_FOUND))
    }
    return res.status(StatusCodes.OK).json({message:"Found",isExist}) 
}
//6]================= Get All Categories =================
export const getAllCategories = async(req,res,next) =>{
    const selectall = categoryModel.find()
    const api = new ApiFeatures(selectall,req.quey)
    .pagination(categoryModel)
    .sort()
    .filer()
    .search()
    .select()
    const Categories=await api.mongooseQuery
    return res.status(StatusCodes.OK).json({message:"Found",Categories}) 
}

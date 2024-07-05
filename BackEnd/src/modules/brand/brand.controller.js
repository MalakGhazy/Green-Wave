import { StatusCodes } from "http-status-codes"
import brandModel from "../../../DB/model/brand.model.js"
import slugify from "slugify"
import { ErrorClass } from "../../utils/errorClass.js"
import { ApiFeatures } from "../../utils/apiFeatures.js"

//1]=========== Add Brand ==============
export const addBrand = async(req,res,next)=>{
    let{name}=req.body
    const userId=req.user._id
    const isExist = await brandModel.findOne({name})
    if(isExist){
        return next (new ErrorClass(`Brand ${name} already exists`))
    }
    const brand = await brandModel.create({
        name,
        slug:slugify(name),
        createdBy:userId
    })
    res.status(StatusCodes.CREATED).json({message:"Done",brand})
}
//2]================= Update Brand =================
export const updateBrand = async(req,res,next)=>{
    const{brandID} = req.params
    const brand=await brandModel.findById(brandId)
    if (!brand)
    {
        return next (new ErrorClass('Brand is not found'))
    } 

    if(req.body.name)
  {
    const nameExist = await brandModel.findOne({name:req.body.name,_id:{$ne:brandId}})
    if(nameExist)
    {
      return next (new ErrorClass (`Brand ${name} already exists`))
    }
    brand.name=req.body.name
    brand.slug=slugify(req.body.name,'-')
  }
  brand.save()
  return res.status(StatusCodes.ACCEPTED).json({message:"Done",brand})
}
//3]================= Delete  Brand ===================
export const DeleteBrand = async(req,res,next)=>
{
    const {brandId}=req.params
    const isExist=await brandModel.findByIdAndDelete(brandId)
    if (!isExist)
    {
        return next (new ErrorClass('Brand is not found'))
    } 
    return res.status(StatusCodes.ACCEPTED).json({message:"Done",isExist})
}
        
//4]================= Search Brand ====================
// ===============Should be replaced by API Features=========
export const SearchByName = async(req,res,next)=>{
    const {searchkey}=req.query
  const brands=await brandModel.find({
    name:{
      $regex:`${searchkey}`
    }
  })
  if(brands == 0)
    {
        return next (new ErrorClass('There is no any Brands'))
    }
  res.status(StatusCodes.OK).json({message:"Found",brands})
}
//5]================= Get Brand By Id =================
export const getById = async(req,res,next)=>
    {
      const {brandId}=req.params
      const isExist=await brandModel.findById(brandId)
        if (!isExist)
        {
            return next (new ErrorClass('Brand not found'))
        }
        return res.status(StatusCodes.OK).json({message:"Found",isExist}) 
    }
//6]================= Get All Brands =================
export const getAllBrands = async(req,res,next)=>
    {
      const selectall = brandModel.find()
      const api = new ApiFeatures(selectall,req.query)
      .pagination(brandModel)
      .sort()
      .filter()
      .search()
      .select()
      const brands = await api.mongooseQuery
      res.status(StatusCodes.OK).json({
        message:"Found",
        brands,
        count : api.queryData.count,
        totalPages: api.queryData.totalPages,
        next:api.queryData.next,
        previous:api.queryData.previous
      })
    }
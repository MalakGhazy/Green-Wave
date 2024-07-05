import { StatusCodes } from "http-status-codes"
import productModel from "../../../DB/model/product.model.js"
import { ErrorClass } from "../../utils/errorClass"
import userModel from "../../../DB/model/user.model.js"

//============= 1] Add (product) to wishlist =================
export const addpPoductWishList = async (req,res,next)=>{
    const productId=req.params.productId
    const product = await productModel.findById(productId)
    if(!product){
        return next (ErrorClass("Product is not found",StatusCodes.NOT_FOUND))
    }
    const user = await userModel.updateOne({_id:req.user.id},
        {$addToSet:{
            favorites:productId
        }
    }
    )
    res.status(200).json({message:'DONE',user})
}
//============= 2] Add (book) to wishlist =================
export const addBookWishList = async (req,res,next)=>{
    const bookId=req.params.bookId
    const book = await productModel.findById(bookId)
    if(!book){
        return next (ErrorClass("Book is not found",StatusCodes.NOT_FOUND))
    }
    const user = await userModel.updateOne({_id:req.user.id},
        {$addToSet:{
            favorites:bookId
        }
    }
    )
    res.status(200).json({message:'DONE',user})
    
}
//============= 3] Add (course) to wishlist =================
export const addCourseWishList = async (req,res,next)=>{
    const courseId=req.params.courseId
    const course = await productModel.findById(courseId)
    if(!course){
        return next (ErrorClass("Course is not found",StatusCodes.NOT_FOUND))
    }
    const user = await userModel.updateOne({_id:req.user.id},
        {$addToSet:{
            favorites:courseId
        }
    }
    )
    res.status(200).json({message:'DONE',user})
    
}
//============= 4] Remove (product) from wishlist =============
export const removeProductWishList = async(req,res,next)=>{
    const productId=req.params.productId
    const productExist = await productModel.findById(productId)
    if(!productExist){
        return next (ErrorClass("Product is not found",StatusCodes.NOT_FOUND))
    }
    const product = await userModel.updateOne({_id:req.user.id},{
        $pull:{
            favorites:productId
        }
    },
    {new : true})
    res.status(200).json({message:"REMOVED FROM WISHLIST SUCCESS!",DeletedProduct:productExist})
}
//============= 5] Remove (book) from wishlist =============
export const removeBookWishList = async(req,res,next)=>{
    const bookId=req.params.bookId
    const bookExist = await productModel.findById(bookId)
    if(!bookExist){
        return next (ErrorClass("Book is not found",StatusCodes.NOT_FOUND))
    }
    const book = await userModel.updateOne({_id:req.user.id},{
        $pull:{
            favorites:bookId
        }
    },
    {new : true})
    res.status(200).json({message:"REMOVED FROM WISHLIST SUCCESS!",DeletedBook:bookExist})
}
//============= 6] Remove (course) from wishlist =============
export const removeCourseWishList = async(req,res,next)=>{
    const courseId=req.params.courseId
    const courseExist = await productModel.findById(courseId)
    if(!courseExist){
        return next (ErrorClass("Course is not found",StatusCodes.NOT_FOUND))
    }
    const course = await userModel.updateOne({_id:req.user.id},{
        $pull:{
            favorites:courseId
        }
    },
    {new : true})
    res.status(200).json({message:"REMOVED FROM WISHLIST SUCCESS!",DeletedCourse:courseExist})
}

//============= 7] get user wishlist =================
export const getUserWishList=async(req,res,next)=>{
    const userId=req.user._id
    const user = await userModel.findById(userId).populate([{
        path:'favorites'
    }])
    res.status(200).json({message:"Done",user})
}



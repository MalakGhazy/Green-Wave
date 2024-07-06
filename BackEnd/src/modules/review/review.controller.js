import { StatusCodes } from "http-status-codes";
import articleModel from "../../../DB/model/article.model.js";
import bookModel from "../../../DB/model/book.model.js";
import courseModel from "../../../DB/model/course.model.js";
import ordermodel from "../../../DB/model/order.js";
//import orderModel from "../../../DB/model/order.model.js";

import productModel from "../../../DB/model/product.model.js";
import reviewModel from "../../../DB/model/review.model.js";

import { ErrorClass } from "../../utils/errorClass.js";
//============1]Add Review ==================================
export const addReview = async(req,res,next) => {
    const {comment,productId,bookId,courseId,articleId}= req.body

    if (!productId && !bookId && !courseId && !articleId) {
        return next(new Error("No item provided to review", StatusCodes.NOT_FOUND));
    }
    let itemId;
    let itemModel;
    // Determine which item type is being added
     if (productId) {
        itemId = productId;
        itemModel = productModel;
    } else if (bookId) {
        itemId = bookId;
        itemModel = bookModel
    } else if (courseId) {
        itemId = courseId;
        itemModel = courseModel; 
    }
    else if (articleId){
        itemId=articleId,
        itemModel=articleModel
    }
    const item = await itemModel.findById(itemId);
    if (!item) {
        return next(new Error("ITEM NOT FOUND!",StatusCodes.NOT_FOUND));
    }
    // check Type of item 
    if (productId) {
        const alreadyReviewed = await reviewModel.findOne({
            userId: req.user._id,
            productId: productId
        })
        if (alreadyReviewed) {
            return next(new ErrorClass("you already reviewed this product!", 409))
        }
        // check order 
        const order = await ordermodel.findOne({
            userId:req.user_id,
            status:'delivered',
            'items.product.productId':productId
        })
        if (!order)  {
            return next(new ErrorClass("you are not authorized to review this order!", 403))
        }
        // add review
        const review = await reviewModel.create({comment,productId,userId:req.user._id})   
        return res.status(202).json({ message: "Done!", review })  
    }
    else if (bookId) {
        const alreadyReviewed = await reviewModel.findOne({
            userId: req.user._id,
            bookId: bookId
        })
        if (alreadyReviewed) {
            return next(new ErrorClass("you already reviewed this book!", 409))
        }
            // check order
            const order = await ordermodel.findOne({
                userId:req.user_id,
                status:'delivered',
                'items.book.bookId':bookId
            })
            if (!order)  {
                return next(new ErrorClass("you are not authorized to review this order!", 403))
            }
            
            // add review
        const review = await reviewModel.create({comment,bookId,userId:req.user._id})  
        return res.status(202).json({ message: "Done!", review })  
    } else if (courseId) {
        const alreadyReviewed = await reviewModel.findOne({
            userId: req.user._id,
            courseId: courseId
        })
        if (alreadyReviewed) {
            return next(new ErrorClass("you already reviewed this course!", 409))
        }
            // check order 
            const order = await ordermodel.findOne({
                userId:req.user_id,
                status:'delivered',
                'items.course.courseId':courseId
            })
            if (!order)  {
                return next(new ErrorClass("you are not authorized to review this order!", 403))
            }
            // add review
        const review = await reviewModel.create({comment,courseId,userId:req.user._id})  
        return res.status(202).json({ message: "Done!", review })  
    }
    else if (articleId){
        const alreadyReviewed = await reviewModel.findOne({
            userId: req.user._id,
            articleId: articleId
        })
        if (alreadyReviewed) {
            return next(new ErrorClass("you already reviewed this article!", 409))
        }
        // add review
        const review = await reviewModel.create({comment,articleId,userId:req.user._id})
        return res.status(202).json({ message: "Done!", review })  

    }
}
// ============ 2] Get all user reviews ====================
export const getUserReviews = async(req,res,next)=>{
    const reviews = await reviewModel.find({userId:req.user_id})
    if(!reviews){
        return next(new ErrorClass("No reviews found for this user", StatusCodes.NOT_FOUND))
    }
    return res.status(200).json({message:"Found",reviews})
}
// ===============3] Update Review ===============
export const updateReview = async(req,res,next)=>{
    const {comment}=req.body
    const reviewId = req.params
    
    const isReviewed = await reviewModel.findOneAndDelete({
        _id:reviewId,
        userId:req.user._id
    })
    if (!isReviewed) {
        return next(new ErrorClass("this review does not exist!", 404))
    }
    isReviewed.comment= comment
    await isReviewed.save()
    res.status(200).json({ message: "Done!", review: isReviewed })
}
// =================== 4] Delete Review ==========
export const deleteReview = async(req,res,next)=>{
    const reviewId = req.params
    
    const isReviewed = await reviewModel.findOneAndDelete({
        _id:reviewId,
        userId:req.user._id
    })
    if (!isReviewed) {
        return next(new ErrorClass("this review does not exist!", 404))
    }
    res.status(200).json({ message: "Done!", review: isReviewed })

}
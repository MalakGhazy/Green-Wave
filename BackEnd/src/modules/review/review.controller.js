import { StatusCodes } from "http-status-codes";
import articleModel from "../../../DB/model/article.model.js";
import bookModel from "../../../DB/model/book.model.js";
import courseModel from "../../../DB/model/course.model.js";
import ordermodel from "../../../DB/model/order.js";
import productModel from "../../../DB/model/product.model.js";
import reviewModel from "../../../DB/model/review.model.js";
import { ErrorClass } from "../../utils/errorClass.js";
//================= 1]Add Review ==================================
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
        // Check if the user has already reviewed this item
        const alreadyReviewed = await reviewModel.findOne({ userId: req.user._id, ...req.body });
        if (alreadyReviewed) {
            return next(new ErrorClass(`You already reviewed this item!`, StatusCodes.CONFLICT));
        }
    
        // If reviewing an article, simply create the review
        if (articleId) {
            try {
                const review = await reviewModel.create({
                    comment,
                    articleId,
                    userId: req.user._id
                });
                return res.status(StatusCodes.ACCEPTED).json({ message: "Review added successfully", review });
            } catch (error) {
                return next(new ErrorClass(`Error adding review: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR));
            }
        }
    
        // For other item types (product, book, course), validate the order before adding the review
        const orderQuery = {
            userId: req.user._id,
            status: 'delivered',
        };
    
        if (productId) {
            orderQuery['items.product.productId'] = productId;
        } else if (bookId) {
            orderQuery['items.book.bookId'] = bookId;
        } else if (courseId) {
            orderQuery['items.course.courseId'] = courseId;
        }
    
        const order = await ordermodel.findOne(orderQuery);
        if (!order) {
            return next(new ErrorClass("You are not authorized to review this item!", StatusCodes.FORBIDDEN));
        }
    
        try {
            const review = await reviewModel.create({
                comment,
                productId,
                bookId,
                courseId,
                userId: req.user._id
            });
            /*const newAvg = ((item.avgRate * item.rate) + rating) / (item.rate + 1)
            item.avgRate = newAvg
            item.rate = item.rate + 1
            await item.save()*/
            return res.status(StatusCodes.ACCEPTED).json({ message: "Review added successfully", review });
        } catch (error) {
            return next(new ErrorClass(`Error adding review: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR));
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
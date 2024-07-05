import { StatusCodes } from 'http-status-codes';
import cartModel from '../../../DB/model/cart.model.js';
import productModel from '../../../DB/model/product.model.js';
import { ErrorClass } from "../../utils/errorClass.js"
import bookModel from '../../../DB/model/book.model.js';
import courseModel from '../../../DB/model/course.model.js';

// 1] Add Product to Cart
export const addItemToCart = async (req,res,next) => {
    const { productId,bookId, courseId ,quantity } = req.body;

    if (!productId && !bookId && !courseId) {
        return next(new Error("No item provided to add to cart", StatusCodes.NOT_FOUND));
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
    const item = await itemModel.findById(itemId);

    if (!item) {
        return next(new Error("ITEM NOT FOUND!",StatusCodes.NOT_FOUND));
    }
    // if the product is out of stock , it will automatically added
    // to the user wishlist to be aware when it is back in the stock 
    
    //console.log(req.body);

    if(itemModel === productModel && item.stock < quantity){
        await productModel.updateOne(
            {_id:itemId},
            {
                $addToSet:{
                    wishlist:req.user._id 
                }
            }
        )
        return next (new ErrorClass("OUT OF STOCK! The product has been added to your wishlist.",StatusCodes.BAD_REQUEST))
    }
    let cart = await cartModel.findOne({userId:req.user._id})
    
    if (!cart) {
        cart = new cartModel({ userId: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) =>
        item.productId?.toString() === itemId ||
        item.bookId?.toString() === itemId ||
        item.courseId?.toString() === itemId
    );

    if (itemIndex === -1) {
        cart.items.push({ productId, bookId, courseId, quantity });
    } else {
        cart.items[itemIndex].quantity += quantity;
    }
    await cart.save();
    res.status(201).json({ message: 'ITEM ADDED TO CART', cart })
};

// 2] Remove item from Cart
export const removeItemFromCart = async (req, res) => {

    const { itemId } = req.params;

    let cart = await cartModel.findOne({userId: req.user._id});
    if (!cart) {
        return next (new ErrorClass("Cart is not found",StatusCodes.NOT_FOUND))
    }

    // Check if the item exists in the cart
    const itemIndex = cart.items.findIndex((item) =>
        item.productId?.toString() === itemId ||
        item.bookId?.toString() === itemId ||
        item.courseId?.toString() === itemId
    );

    if (itemIndex === -1) {
        return next (new ErrorClass("Item not found in cart",StatusCodes.NOT_FOUND))
    }

    const updatedCart = await cartModel.findOneAndUpdate(
        {userId:req.user._id},
        {
            $pull:{
                items:{
                    $or:[
                        {productId:itemId},
                        {bookId:itemId},
                        {courseId:itemId}
                    ]
                }
            }
        },
        {new:true}
    )

    // Check if the item was actually removed
    const itemExists = updatedCart.items.some(
        (item) => item.productId?.toString() === itemId ||
                  item.bookId?.toString() === itemId ||
                  item.courseId?.toString() === itemId
    );

    if (itemExists) {
        return next (new ErrorClass("Item not found in cart",StatusCodes.NOT_FOUND))
    }
    return res.status(StatusCodes.OK).json({ message: "Item removed from cart", cart: updatedCart });
};

// 3] Get Cart Items
export const getCartItems = async (req, res) => {
    const cart = await cartModel.findOne({userId:req.user._id})
    .populate('items.productId','name price')
    .populate('items.bookId','title author price')
    .populate('items.courseId','title instructor price');

    if(!cart)
    {
        return next(new ErrorClass("Cart not found", StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({ cart });
};

import Stripe from "stripe";
import cartModel from "../../../DB/model/cart.model.js";
import { couponModel } from "../../../DB/model/coupon.model.js";
import orderModel from "../../../DB/model/order.model.js";
import productModel from "../../../DB/model/product.model.js";
import { StatusCodes } from "http-status-codes";
import bookModel from "../../../DB/model/book.model.js";
import courseModel from "../../../DB/model/course.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createOrder = async(req,res,next)=>{
    let product,itemTypeModel;
    let{items,address,phone,notes,coupon,paymentMethod}= req.body
    const userId=req.user._id

    const cart = await cartModel.findOne({userId:req.user._id})
    if(!items)
    {
        if(!cart.items.length){
            return next(new Error('CART IS EMPTY!',StatusCodes.NOT_FOUND))
        }
        items=cart.items
    }

    const existedItems=[]
    const foundedIds=[]
    const arrayForStock=[]
    let price=0

    for(let item of items){
        switch(item.itemType){
            case 'Product':
                itemTypeModel=productModel;
                break;
            case 'Book':
                itemTypeModel=bookModel;
                break;
            case 'Course':
                itemTypeModel=courseModel;
                break;
            default:
                return next(new Error('Invalid item type', StatusCodes.BAD_REQUEST));
        }
        try{

            product=await itemTypeModel.findById(item.itemId);
        if(!product){
            return next(new Error(`${item.itemType} with id ${item.itemId} not found`, StatusCodes.NOT_FOUND));
        }

        existedItems.push({
            itemType:item.itemType,
            itemId:product._id,
            quantity:item.quantity,
            price:product.price * item.quantity,

        });

        foundedIds.push(product._id);

        if(item.itemType!== 'Course'){ 
            //Courses does not have stock
            arrayForStock.push({
                _id:product._id,
                quantity:item.quantity,
            });
            price+=product.price * item.quantity;
        }
        }
        catch(error){
            return next(new Error(`Error fetching ${item.itemType} with id ${item.itemId}: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR));
        } 
    }

    // Apply coupon if exists
    let discount=0;
    if(coupon){
        try{
            const foundCoupon = await couponModel.findById(coupon);
        if(foundCoupon && foundCoupon.$isValid){
            discount=foundCoupon.discount;
            price -= discount
        }
        else{
            return next(new Error('Invalid or expired coupon', StatusCodes.BAD_REQUEST));
        }
        } 
        catch (error) {
            return next(new Error(`Error fetching coupon: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR));
        }
    }


    //Update Stock
    for(let item of arrayForStock){
        try{
            const product = await itemTypeModel.findById(item._id)
        if(!product){
            return next(new Error(`Item with id ${item._id} not found`, StatusCodes.NOT_FOUND));
        }
        if(product.stock < item.quantity){
            return next(new Error(`Item with id ${item._id} has insufficient stock`, StatusCodes.BAD_REQUEST));
        }
        product.stock -= item.quantity;
        await product.save()
        }
        catch(error)
        {
            return next(new Error(`Error updating stock for item with id ${item._id}: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR));
        }
    }

    const order = new orderModel({
        userId:req.user._id,
        items:existedItems,
        address,
        phone,
        notes,
        coupon,
        price,
        paymentPrice:price,
        paymentMethod,
    });
    
    // Use Stripe For Payment
    if(paymentMethod === 'Card'){
        try{
        if(req.body.coupon){
            const coupon = await stripe.coupons.create({
                percent_off:req.body.coupon.amount,
                duration:"once"
            })
            req.body.StripeCoupon=coupon.id
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode:"payment",
            customer_email:req.user.email,
            metadata:{
                orderId:order._id.toString()
            },
            success_url:`http://localhost:3000/order/complete?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/order/cancel`,
            discounts:req.body.StripeCoupon?[{coupon:req.body.StripeCoupon}]:[],
            line_items:existedItems.map(element=>{
                return{
                    price_data:{
                        currency:'EGP',
                        product_data:{
                            name:element.product.name
                        },
                        unit_amount:(element.product.paymentPrice)*100
                    },
                    quantity:element.quantity
                }
            })
        })

        if(req.body.coupon){
            await couponModel.updateOne({code:req.body.coupon.code},
            {
                $addToSet:{
                    UsedBy:req.user._id
                }
            })
        }
        if(req.body.items){
            const productIds = req.body.items
            .filter(item => item.itemType === 'Product')
            .map(item=>item.itemId);
    
            const bookIds = req.body.items
            .filter(item => item.itemType === 'Book')
            .map(item=>item.itemId);
    
            const courseIds = req.body.items
            .filter(item => item.itemType === 'Course')
            .map(item=>item.itemId);
    
            // Remove Products
            if(productIds.length>0){
                await cartModel.updateOne(
                    {userId:req.user._id},
                    {
                        $pull:{
                            items:{
                                productId:{
                                    $in: productIds
                                }
                            }
                        }
                    }
                );
            }
    
            // Remove Books
            if(bookIds.length>0){
                await cartModel.updateOne(
                    {userId:req.user._id},
                    {
                        $pull:{
                            items:{
                                bookId: {
                                    $in : bookIds
                                }
                            }
                        }
                    }
                )
            }
    
            //Remove Courses
            if(courseIds.length>0){
                await cartModel.updateOne(
                    {userId:req.user._id},
                    {
                        $pull:{
                            items:{
                                courseId:{
                                    $in:courseIds
                                }
                            }
                        }
                    }
                )
            }
        }
        else 
        {
            await cartModel.updateOne({userId:req.user._id},{items:[]})
        }
        return res.status(200).json({message:"DONE",order,url:session.url})  
    }
    catch(error)
    {
        return next(new Error(`Error processing payment: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR));
    }
    }

    // For Cash payment or other methods without Stripe
    if(req.body.items){
        const productIds = req.body.items
        .filter(item => item.itemType === 'Product')
        .map(item=>item.itemId);

        const bookIds = req.body.items
        .filter(item => item.itemType === 'Book')
        .map(item=>item.itemId);

        const courseIds = req.body.items
        .filter(item => item.itemType === 'Course')
        .map(item=>item.itemId);

        // Remove Products
        if(productIds.length>0){
            await cartModel.updateOne(
                {userId:req.user._id},
                {
                    $pull:{
                        items:{
                            productId:{
                                $in: productIds
                            }
                        }
                    }
                }
            );
        }

        // Remove Books
        if(bookIds.length>0){
            await cartModel.updateOne(
                {userId:req.user._id},
                {
                    $pull:{
                        items:{
                            bookId: {
                                $in : bookIds
                            }
                        }
                    }
                }
            )
        }

        //Remove Courses
        if(courseIds.length>0){
            await cartModel.updateOne(
                {userId:req.user._id},
                {
                    $pull:{
                        items:{
                            courseId:{
                                $in:courseIds
                            }
                        }
                    }
                }
            )
        }
    }
    else 
    {
        await cartModel.updateOne({userId:req.user._id},{items:[]})
    }

    // Update coupon usage for cash payments
    if(req.body.coupon){
        await couponModel.updateOne({code:req.body.coupon.code},
        {
            $addToSet:{
                    UsedBy:req.user._id
            }
        })
    }
    // Save Order
    try {
        await order.save();
        res.status(StatusCodes.CREATED).json({ order });
    } catch (error) {
        return next(new Error(`Error saving order: ${error.message}`, StatusCodes.INTERNAL_SERVER_ERROR));
    }
    // Coupon Part 
    /*
    if (coupon) {
        const isCouponExist = await couponModel.findOne({
            code: coupon,
        })
        if (!isCouponExist) return next(new ErrorClass("in-valid coupon!", 404))
        if (isCouponExist.expiryDate < Date.now()) return next(new ErrorClass("Coupon expired!", 410))
        if (isCouponExist.usedBy.length > isCouponExist.noOfUses) return next(new ErrorClass("This coupon exceeded the usage limit", 410))
        if (isCouponExist.usedBy.includes(req.user._id)) return next(new ErrorClass("You've already claimed this coupon", 410))
        req.body.coupon = isCouponExist
    }
    */
}
// Get all orders for a user (Orders Hostory)
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.user._id;
        const orders = await orderModel.find({ userId ,
            status:{
                $nin : ['cancelled']
            }
        }     
        )
        .select('address items paymentPrice status')
        if(orders.length==0){
            return next(new ErrorClass("no orders were found for this user",StatusCodes.NOT_FOUND))
        }
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update order status --> Tracking
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// cancel order
export const cancelOrder = async(req,res,next)=>{
    const orderId = req.params.id
    const userId = req.user._id
    const {reason} =  req.body
    const isOrderExist = await orderModel.findOne({_id:orderId,userId})
    if(!isOrderExist){
        return next(new ErrorClass("this order doesn't exist or you do not own this order!", StatusCodes.NOT_FOUND))
    }
    //checking if the order is alreday delievered
    if(isOrderExist.status == 'delivered'){
        return next(new ErrorClass("this order has already been delivered", StatusCodes.FORBIDDEN))
    }
    //update the status  & adding the reason
    await orderModel.findByIdAndUpdate(orderId,
        {
            status:'cancelled',reason
        }
    )
    return res.status(200).json({message:"Order Cancelled Successfully"})
}
     // invoice
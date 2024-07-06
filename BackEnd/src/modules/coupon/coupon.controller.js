import { StatusCodes } from "http-status-codes";
import userModel from "../../../DB/model/user.model.js"
import { ErrorClass } from "../../utils/errorClass.js";
import { nanoid } from "nanoid";
import { couponModel } from "../../../DB/model/coupon.model.js";

export const addCoupon = async(req,res,next)=>{
    const user = await userModel.findById(req.user._id)
    if(!user){
        return next(new ErrorClass('User is not found', StatusCodes.NOT_FOUND));
    }
    const createdBy=req.user._id
    const points = user.points
    if (typeof points !== 'number' || isNaN(points)) {
        return next(new ErrorClass('Invalid points value', StatusCodes.BAD_REQUEST));
    }
    const amount=(Math.floor(points/10)*10);

    if(amount<=0){
        return next(new ErrorClass('Insufficient points for a coupon', StatusCodes.BAD_REQUEST));
    }

    user.points =0;
    await user.save()

    const code = nanoid(8)

    const coupon = new couponModel({
        code,
        amount,
        createdBy
    })
    await coupon.save()
    res.status(200).json({ message: 'Coupon Created Successfully', coupon });
}
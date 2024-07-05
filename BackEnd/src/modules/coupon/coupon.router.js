import { couponModel } from "../../../DB/model/coupon.model.js"

export const createCoupon = async(req,res,next)=>{
    const {code,amount,EXPDate,numofUses}=req.body
    const couponExist = await couponModel.findOne({code})
    if(cuponExist){
        return next (new Error (`${code} ALREADY EXIST!`,{cause:400}))
    }
    const cupon= await CuponModel.create({
        code,amount,EXPDate,numofUses,
        createdBy:req.user._id
    })
    res.status(201).json({message:"DONE",cupon})

}
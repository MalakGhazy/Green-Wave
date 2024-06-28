import Jwt from "jsonwebtoken"
import userModel from "../../DB/model/user.model.js"
import { StatusCodes } from "http-status-codes"
import { isTokenBlackListed } from "../utils/tokenClackList.js"
export const roles={
    admin:'Admin',
    user:'User'
}

//Object.freeze(roles)
export const auth = () => {
    return async (req,res,next)=>
        {
            const{authorization}=req.headers;
            //console.log(authorization);
            if(!authorization){
                return res.status(400).json({message:'Please Login First'})
            }
            if(!authorization.startsWith(process.env.BEARER_KEY)){
                return res.json({message:"In-valid bearer key"})
            }
            const token = authorization.split(process.env.BEARER_KEY)[1]
            //console.log(token);
            if(isTokenBlackListed(token)){
                return next (new ErrorClass('Token is BlackListed',StatusCodes.UNAUTHORIZED))
            }
            if(!token){
                return next (new ErrorClass('Invalid Token',StatusCodes.UNAUTHORIZED))
            }
            const decoded = Jwt.verify(token,process.env.TOKEN_SIGNATURE)
            if(!decoded?.id){
                return res.json({message:"In-valid Token Payload"})
            }
            const authUser = await userModel.findById(decoded.id).select('-password')
            if(!authUser){
                return res.json({message:"Not Registered Account"})
            }
            /*if(!roles.includes(authUser.role)){
                res.status(StatusCodes.UNAUTHORIZED).json({message:"Not Authorized User"})
            }*/
            req.user=authUser;
            next()
    }
}
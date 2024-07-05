import productModel from '../../../DB/model/product.model.js';
import brandModel from '../../../DB/model/brand.model.js'
import categoryModel from '../../../DB/model/category.model.js'
import cloudinary from '../../utils/cloudinary.js'
import { ApiFeatures } from "../../utils/apiFeatures.js";
import { ErrorClass } from "../../utils/errorClass.js";
import StatusCodes from "http-status-codes"
import slugify from "slugify"

// 1] Add Product
export const addProduct = async (req, res,next) => {
    // if product name already exist ->> then increment the stock by the sent quantity
    const nameExist = await productModel.findOne({name:req.body.name})
    if(nameExist)
    {
        nameExist.stock += Number(req.body.stock)
        await nameExist.save()
        return res.status(StatusCodes.ACCEPTED).json({message:"Done",product:nameExist})
    }
    if(!await categoryModel.findById(req.body.categoryId))
    {
        //return next (new Error('This Category is not found'))
        return next (new ErrorClass('This Category is not found',StatusCodes.NOT_FOUND))
    }
    if(!await brandModel.findById(req.body.brandId))
    {
       // return next (new Error('This Sub-Category is not found'))
       return next (new ErrorClass('This Brand is not found',StatusCodes.NOT_FOUND))
    }
    req.body.slug = slugify(req.body.name)
    req.body.stock =req.body.stock
    req.body.paymentPrice = (req.body.price -(req.body.price * ((req.body.discount || 0) /100)))
    
    //res.json({files:req.files})
   // console.log(req)

   const {secure_url,public_id}= await cloudinary.uploader.upload(req.file.path,{folder:`GreenWave/Product`})
   req.body.image={secure_url,public_id}

   req.body.createdBy=req.user._id
   const product = await productModel.create(req.body)
   res.status(StatusCodes.CREATED).json({message:"Done",product})
};

// 2] Update Product
export const updateProduct = async (req,res,next) => {
        const { productId } = req.params;
        const product = await productModel.findById(productId)
        if(!product){
            return next (new ErrorClass ("PRODUCT NOT FOUND!",StatusCodes.NOT_FOUND))
        }

        const categoryExist = await categoryModel.findById(req.body.categoryId || product.categoryId)
        if(req.body.categoryId){
            if(!categoryExist){
                return next (new Error("INVALID CATEGORY ID",StatusCodes.NOT_FOUND))
            }
            product.categoryId= req.body.categoryId
        }

        const brandExist = await brandModel.findById(req.body.brandId || product.brandId)
        if(req.body.brandId){
            if(!brandExist){
                return next(new ErrorClass("IN_VALID Brand ID",StatusCodes.NOT_FOUND))
            }
            product.brandId=req.body.brandId
        }

        if(req.body.price){
            if(product.price==req.body.price)
            {
                return next (new ErrorClass ("PLEASE ENTER DIFF PRICE FROM THE OLD ONE",StatusCodes.CONFLICT))
            }
            product.price=req.body.price
        }

        if(req.body.name){
            if(product.name==req.body.name){
                return next (new ErrorClass ("PLEASE ENTER DIFF NAME FROM THE OLD ONE",{cause:409}))
            }
            product.name=req.body.name
            product.slug=slugify(req.body.name,"_")
        }

    if(req.files.image){
            // 1] Delete The old Category Image 
      await cloudinary.uploader.destroy(product.image.public_id)
      // 2] upload the new Category Image 
      const {secure_url,public_id} = await cloudinary.uploader.upload(req.file.path,{folder:'GreenWave/Product'})
      // store the new image in cloudinary
      // 3] update the DB
      product.image={secure_url,public_id}
  }

  if(req.body.quantity){
    product.stock=req.body.quantity
}
await product.save()
return res.status(200).json({message:"UPDATED SUCCESS!",product})        
};
// 3] Delete Product
export const deleteProduct = async (req, res,next) => {
     const { productId } = req.params;
    const product = await productModel.findByIdAndDelete(productId);
    if (!product) {
        return next (new ErrorClass('INVALID PRODUCT ID',StatusCodes.NOT_FOUND))
    }
    await cloudinary.uploader.destroy(product.image.public_id)
    res.status(200).json({ message: 'Product deleted successfully' });
};

// 4] Search Product -----> Api features Missed
export const searchProduct = async (req, res) => {
    const { searchkey } = req.query;
    const products = await productModel.find({ 
        name: { 
            $regex:`${searchkey}`
            //$options: 'i' 
            } });
    if(!products){
        return next (new Error('The product is not found',StatusCodes.NOT_FOUND))
    }       
    res.status(200).json(products);
};

// 5] Get Product By Id
export const getProductById = async (req, res,next) => {
        const { productId } = req.params;
        const product = await productModel.findById(productId);
        if (!product) {
            return next (new ErrorClass('This Product is not found',StatusCodes.NOT_FOUND))
        }
        res.status(200).json({message:"Found",product});
};

// 6] Get All Products
export const getAllProducts = async (req, res) => {
    const selectall = productModel.find()
    const api = new ApiFeatures(selectall,req.query)
    .pagination(productModel)
    .sort()
    .filter()
    .search()
    .select()
    const products = await api.mongooseQuery
    return res.status(StatusCodes.OK).json({
        message:"Found",
        products,
        count : api.queryData.count,
        totalPages: api.queryData.totalPages,
        next:api.queryData.next,
        previous:api.queryData.previous
    })

};

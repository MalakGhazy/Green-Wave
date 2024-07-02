import Product from '../../../DB/model/product.model.js';

// 1] Add Product
export const addProduct = async (req, res) => {
    try {
        const { name, description, stock, price, discount, paymentPrice, image, categoryId, brandId, createdBy } = req.body;
        const product = new Product({ name, description, stock, price, discount, paymentPrice, image, categoryId, brandId, createdBy });
        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2] Update Product
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, stock, price, discount, paymentPrice, image, categoryId, brandId, avgRate, soldItems } = req.body;
        const product = await Product.findByIdAndUpdate(
            productId,
            { name, description, stock, price, discount, paymentPrice, image, categoryId, brandId, avgRate, soldItems },
            { new: true }
        );
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3] Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4] Search Product
export const searchProduct = async (req, res) => {
    try {
        const { query } = req.query;
        const products = await Product.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5] Get Product By Id
export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 6] Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

import Category from '../../../DB/model/category.model.js';

// 1] Add Category
export const addCategory = async (req, res) => {
    try {
        const { name, description, createdBy } = req.body;
        const category = new Category({ name, description, createdBy });
        await category.save();
        res.status(201).json({ message: 'Category added successfully', category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2] Update Category
export const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true }
        );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3] Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4] Search Category
export const searchCategory = async (req, res) => {
    try {
        const { query } = req.query;
        const categories = await Category.find({ name: { $regex: query, $options: 'i' } });
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5] Get Category By Id
export const getCategoryById = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 6] Get All Categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

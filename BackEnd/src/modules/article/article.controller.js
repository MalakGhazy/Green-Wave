import Article from '../../../DB/model/article.model.js';

// 1] Add Article
export const addArticle = async (req, res) => {
    try {
        const { title, content, author, tags, publishedDate, coverImage, createdBy } = req.body;
        const article = new Article({ title, content, author, tags, publishedDate, coverImage, createdBy });
        await article.save();
        res.status(201).json({ message: 'Article added successfully', article });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2] Update Article
export const updateArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const { title, content, author, tags, publishedDate, coverImage } = req.body;
        const article = await Article.findByIdAndUpdate(
            articleId,
            { title, content, author, tags, publishedDate, coverImage },
            { new: true }
        );
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json({ message: 'Article updated successfully', article });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3] Delete Article
export const deleteArticle = async (req, res) => {
    try {
        const { articleId } = req.params;
        const article = await Article.findByIdAndDelete(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json({ message: 'Article deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4] Search Articles
export const searchArticles = async (req, res) => {
    try {
        const { query } = req.query;
        const articles = await Article.find({ title: { $regex: query, $options: 'i' } });
        res.status(200).json(articles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5] Get Article By Id
export const getArticleById = async (req, res) => {
    try {
        const { articleId } = req.params;
        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 6] Get All Articles
export const getAllArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        res.status(200).json(articles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

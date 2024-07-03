import Book from '../../../DB/model/book.model.js';

// 1] Add Book
export const addBook = async (req, res) => {
    try {
        const { title, author, genre, publishedDate, price, description, coverImage, createdBy } = req.body;
        const book = new Book({ title, author, genre, publishedDate, price, description, coverImage, createdBy });
        await book.save();
        res.status(201).json({ message: 'Book added successfully', book });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 2] Update Book
export const updateBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const { title, author, genre, publishedDate, price, description, coverImage } = req.body;
        const book = await Book.findByIdAndUpdate(
            bookId,
            { title, author, genre, publishedDate, price, description, coverImage },
            { new: true }
        );
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book updated successfully', book });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 3] Delete Book
export const deleteBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findByIdAndDelete(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 4] Search Books
export const searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        const books = await Book.find({ title: { $regex: query, $options: 'i' } });
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 5] Get Book By Id
export const getBookById = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 6] Get All Books
export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

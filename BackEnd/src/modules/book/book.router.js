import { Router } from 'express';
import {
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
    getBookById,
    getAllBooks
} from './book.controller.js';

const router = Router();

router.post('/book', addBook);
router.put('/book/:bookId', updateBook);
router.delete('/book/:bookId', deleteBook);
router.get('/book/search', searchBooks);
router.get('/book/:bookId', getBookById);
router.get('/books', getAllBooks);

export default router;

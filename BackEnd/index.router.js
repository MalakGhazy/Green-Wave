import connectDB from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js"
import brandRouter from "./src/modules/brand/brand.router.js"
import wasteRouter from "./src/modules/wasteCollection/wasteCollection.router.js"
import urbanGreeningRouter from './src/modules/urbanGreening/urbanGreening.router.js';
import wasteReportRouter from "./src/modules/wasteReport/wasteReport.router.js";
import orderRouter from './src/modules/order/order.router.js';
import productRouter from './src/modules/product/product.router.js';
import courseRouter from './src/modules/course/course.router.js';
import categoryRouter from './src/modules/category/category.router.js';
import cartRouter from './src/modules/cart/cart.router.js';
import { globalErrorHandling } from "./src/utils/errorHandling.js";
import bookRouter from './src/modules/book/book.router.js';
import articleRouter from './src/modules/article/article.router.js';


const initApp = (app,express)=>
{
    //Convert Buffer Data
    app.use(express.json({}))
    //Setup API Routing
    app.use(`/auth`,authRouter)
    app.use('/order', orderRouter);
    //app.use('/payment');
    app.use('/product', productRouter);
    app.use('/course', courseRouter);
    app.use('/category', categoryRouter);
    app.use('/cart', cartRouter);
    //app.use(`/user`,)
    app.use(`/brand`,brandRouter)
    app.use('/waste-collection',wasteRouter)
    app.use('/urban-greening', urbanGreeningRouter);
    app.use('/waste-reporting', wasteReportRouter);
    app.use('/book', bookRouter);
    app.use('/article', articleRouter);
    app.all('*',(req,res,next)=>{
        res.send("In-valid Routing please check URL or Method")
    })
    app.use(globalErrorHandling)

    connectDB()
}

export default initApp

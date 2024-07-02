import connectDB from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js"
import wasteRouter from "./src/modules/wasteCollection/wasteCollection.router.js"
import urbanGreeningRouter from './src/modules/urbanGreening/urbanGreening.router.js';
import wasteReportRouter from "./src/modules/wasteReport/wasteReport.router.js";
import orderRouter from './src/modules/order/order.router.js';
import productRouter from './src/modules/product/product.router.js';
import courseRouter from './src/modules/course/course.router.js';
import categoryRouter from './src/modules/category/category.router.js';
import cartRouter from './src/modules/cart/cart.router.js';
import { globalErrorHandling } from "./src/utils/errorHandling.js";

const initApp = (app,express)=>
{
    //Convert Buffer Data
    app.use(express.json({}))
    //Setup API Routing
    app.use(`/auth`,authRouter)
    app.use('/api', orderRouter);
    app.use('/api', productRouter);
    app.use('/api', courseRouter);
    app.use('/api', categoryRouter);
    app.use('/api', cartRouter);
    //app.use(`/user`,)
    //app.use(`/brand`,)
    //app.use(`/article`,)
    app.use('/waste-collection',wasteRouter)
    app.use('/urban-greening', urbanGreeningRouter);
    app.use('/waste-reporting', wasteReportRouter);

    app.all('*',(req,res,next)=>{
        res.send("In-valid Routing please check URL or Method")
    })
    app.use(globalErrorHandling)

    connectDB()
}

export default initApp

import connectDB from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js"
import wasteRouter from "./src/modules/wasteCollection/wasteCollection.router.js"
import { globalErrorHandling } from "./src/utils/errorHandling.js";
const initApp = (app,express)=>
{
    //Convert Buffer Data
    app.use(express.json({}))
    //Setup API Routing
    app.use(`/auth`,authRouter)
    //app.use(`/user`,)
    //app.use(`/product`,)
    //app.use(`/category`,)
    //app.use(`/brand`,)
    //app.use(`/cart`,)
    //app.use(`/order`,)
    //app.use(`/course`,)
    //app.use(`/article`,)
    app.use('/waste-collection',wasteRouter)
    app.all('*',(req,res,next)=>{
        res.send("In-valid Routing please check URL or Method")
    })
    app.use(globalErrorHandling)

    connectDB()
}

export default initApp

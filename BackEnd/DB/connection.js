import mongoose from "mongoose"

const connectDB = async()=> {
    return await mongoose.connect(`mongodb+srv://gmalak541:pSCxIZpuYqKnCB6N@greenwave.rsffrse.mongodb.net/GreenWave?retryWrites=true&w=majority&appName=GreenWave`)
    .then(res=>{
        console.log(`DB Connected Successfully...........`);
    }).catch(
        err=>{
            console.log(`Failed Connection: ${err}`);
        }
    );
}

export default connectDB
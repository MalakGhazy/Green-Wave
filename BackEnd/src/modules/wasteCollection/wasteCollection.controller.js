import userModel from "../../../DB/model/user.model.js";
import wasteCollectionModel from "../../../DB/model/wasteCollection.model.js";
import sendEmail, { createHtml } from "../../utils/email.js";

//1]================== Schedule Waste Collection  ========================
export const ScheduleWasteCollection = async(req,res,next)=>{
    try{
        const userId=req.user._id
        const {wasteType,amount,date,time}= req.body;
        const user = await userModel.findById(userId)
        const appointment = new wasteCollectionModel({
        userId,
        wasteType,
        amount,
        date,
        time,
        email:user.email
    });
    await appointment.save();

    //user.points = (user.points || 0) + (amount * 10); // Ensure user.points is initialized to 0 if undefined
    user.points += (amount * 10); // Ensure user.points is initialized to 0 if undefined
    await user.save();

    const html = createHtml(`Your appointment for ${wasteType} waste collection has been scheduled on ${date} at ${time}.`)
    sendEmail({to:user.email,subject:'Waste Collection Appointment Confirmation',html})
    res.status(200).send('Appointment scheduled successfully and confirmation email sent')
    }
    catch(error)
    {
        res.status(400).send(`Error scheduling appointment: ${error.message}`);
    }
}
//2]================= Get WasteTypes ==================
export const getWasteTypes = async (req, res, next) => {
    try {
        const wasteTypes = ['Plastic', 'Glass', 'Metal', 'Organic'];
        res.status(200).json(wasteTypes);
    } catch (error) {
        res.status(400).send(`Error fetching waste types: ${error.message}`);
    }
};
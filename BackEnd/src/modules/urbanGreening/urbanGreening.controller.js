import urbanGreeningModel from "../../../DB/model/urbanGreening.model.js";
import sendEmail, { createHtml } from "../../utils/email.js";

// 1]================== Request Urban Greening Assistance ========================
export const requestUrbanGreening = async (req, res, next) => {
    try {
        const { userId, greeningType, date, time } = req.body;
        const user = await userModel.findById(userId);

        const request = new urbanGreeningModel({
            userId,
            greeningType,
            date,
            time,
            email: user.email
        });
        await request.save();

        const html = createHtml(`Your request for ${greeningType} urban greening assistance has been scheduled on ${date} at ${time}.`);
        sendEmail({ to: user.email, subject: 'Urban Greening Assistance Request Confirmation', html });

        res.status(200).send('Request submitted successfully and confirmation email sent');
    } catch (error) {
        res.status(400).send(`Error submitting request: ${error.message}`);
    }
};

// 2]================= Get Urban Greening Guidance ==================
export const getUrbanGreeningGuidance = async (req, res, next) => {
    try {
        // Assuming you have predefined guidance information
        const guidance = [
            { type: 'Tree Planting', info: 'Guidelines and support for tree planting.' },
            { type: 'Community Garden', info: 'Guidelines and support for setting up a community garden.' }
        ];
        res.status(200).json(guidance);
    } catch (error) {
        res.status(400).send(`Error fetching guidance: ${error.message}`);
    }
};

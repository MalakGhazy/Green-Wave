import WasteReport from '../../../DB/model/wasteReport.model.js';

// Report a garbage collection site
export const reportWasteSite = async (req, res) => {
    try {
        const { userId, location, reportType, description } = req.body;

        const report = new WasteReport({
            userId,
            location,
            reportType,
            description
        });

        await report.save();

        res.status(201).json({ message: 'Reported successfully', report });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Retrieve all reported sites
export const getReportedSites = async (req, res) => {
    try {
        const reports = await WasteReport.find().populate('userId', 'firstName lastName email');

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Retrieve points earned by the user for reporting
export const getUserPoints = async (req, res) => {
    const { userId } = req.params;

    try {
        const userPoints = await User.findById(userId, 'points');

        if (!userPoints) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ points: userPoints.points });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

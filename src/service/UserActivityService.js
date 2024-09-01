import LogsheetManualSistemAggregateModel from "../models/LogsheetManualSistemAggregateModel.js";

export const createUserActivity = async (activityData) => {
    try {
        const userActivity = await LogsheetManualSistemAggregateModel.create(activityData);
        res.status(201).json(userActivity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

import LogsheetManualSistemAggregateModel from "../models/LogsheetManualSistemAggregateModel.js";

export const createUserActivity = async (activityData) => {
    const userActivity = await LogsheetManualSistemAggregateModel.create(activityData);
    return userActivity;
};

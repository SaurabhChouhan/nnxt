import mongoose from 'mongoose';
import AppError from '../AppError';
import * as EC from '../errorcodes';

mongoose.Promise = global.Promise;

let warningSchema = mongoose.Schema({
    type: {type: String, default: String},
    releases: [{
        _id: mongoose.Schema.ObjectId
    }],
    releasePlans: [{
        _id: mongoose.Schema.ObjectId
    }],
    taskPlans: [{
        _id: mongoose.Schema.ObjectId
    }]
});

const WarningModel = mongoose.model("Warning", warningSchema);
export default WarningModel;

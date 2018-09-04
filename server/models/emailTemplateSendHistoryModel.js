import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as MDL from "../models"
import moment from 'moment'
import * as SC from "../serverconstants";

import momentTZ from 'moment-timezone'

mongoose.Promise = global.Promise


let emailTemplateSendHistorySchema = mongoose.Schema({
    from: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String, required: [true, 'User first name is required']},
        lastName: {type: String, required: [true, 'User last name is required']},
        employeeCode: String,
    },
    to: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String, required: [true, 'User first name is required']},
        lastName: {type: String, required: [true, 'User last name is required']},
        employeeCode: String,
    },
    templateSubject: String,
    template:String,
    status:String, //Pending, Sent, Failed

    created:{type: Date,default:new Date()},
    updated:{type: Date,default:new Date()},
})

emailTemplateSendHistorySchema.statics.addTemplateSendHistory = async (user,templateHistoryObj) => {
    let emailTemplateHistory = {
        from: templateHistoryObj.from,
        to:templateHistoryObj.to,
        templateSubject:templateHistoryObj.templateSubject,
        template: templateHistoryObj.template,
        status:templateHistoryObj.status,
        created:new Date(),
        updated:new Date()
    }
    return await EmailTemplateSendHistoryModel.create(emailTemplateHistory)
}

emailTemplateSendHistorySchema.statics.deleteTemplateSendHistory = async (user,templateIDs) => {
    if(templateIDs.length > 0){
        templateIDs.forEach(async templateID => {
            let emailTemplate = await EmailTemplateSendHistoryModel.findOne({"_id" : templateID})
            if(!emailTemplate){
                console.log("For Delete Template not found.")
            }
             await EmailTemplateSendHistoryModel.remove({"_id" : emailTemplate._id})
        })
    }else{
        throw new AppError("Template not found.", EC.NOT_FOUND)
    }
    return await EmailTemplateSendHistoryModel.find({})

}

emailTemplateSendHistorySchema.statics.getAllSendTemplatesHistoryList = async (user) => {
    return await EmailTemplateSendHistoryModel.find({})
}

const EmailTemplateSendHistoryModel = mongoose.model("EmailTemplateSendHistory", emailTemplateSendHistorySchema)
export default EmailTemplateSendHistoryModel
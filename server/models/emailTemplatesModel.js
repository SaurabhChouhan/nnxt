import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as MDL from "../models"
import moment from 'moment'
import * as SC from "../serverconstants"

import momentTZ from 'moment-timezone'

mongoose.Promise = global.Promise

let emailTemplatesSchema = mongoose.Schema({
    templateName: {type: String, unique : true , required: [true, 'Template name is required']},
    createdBy: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String},
        lastName: {type: String},
        employeeCode: String,
    },
    approvedBy: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String},
        lastName: {type: String},
        employeeCode: String,
    },
    templateSubject:String,
    templateHeader: String,
    templateBody: String,
    templateFooter: String,
    templateType: String,
    status:String, //Pending, Approved
    isDeleted: {type: Boolean,default:false},

    created:{type: Date,default:new Date()},
    updated:{type: Date,default:new Date()},
})

emailTemplatesSchema.statics.addTemplate = async (user,templateInfoDataObj) => {
    let emailTemplate = {
        createdBy: user,
        templateName:templateInfoDataObj.templateName,
        templateSubject:templateInfoDataObj.templateSubject,
        templateHeader:templateInfoDataObj.templateHeader,
        templateBody: templateInfoDataObj.templateBody,
        templateFooter : templateInfoDataObj.templateFooter,
        templateType : templateInfoDataObj.templateType,
        status:"Pending",
        isDeleted:false,
        created:new Date(),
        updated:new Date()
    }
    return await EmailTemplatesModel.create(emailTemplate)
}


emailTemplatesSchema.statics.updateTemplate = async (user,templateInfoDataObj) => {
    let emailTemplate = await EmailTemplatesModel.findOne({"_id" : templateInfoDataObj._id})
    if(!emailTemplate){
        throw new AppError("Template not found.", EC.NOT_FOUND)
    }
    emailTemplate.createdBy =  user
    emailTemplate.templateSubject = templateInfoDataObj.templateSubject
    emailTemplate.templateHeader = templateInfoDataObj.templateHeader
    emailTemplate.templateBody = templateInfoDataObj.templateBody
    emailTemplate.templateFooter = templateInfoDataObj.templateFooter
    emailTemplate.templateType = templateInfoDataObj.templateType
    emailTemplate.status = "Pending"
    emailTemplate.isDeleted = false
    emailTemplate.updated = new Date()
    return await emailTemplate.save()
}

emailTemplatesSchema.statics.deleteTemplate = async (user,templateID) => {
    let emailTemplate = await EmailTemplatesModel.findOne({"_id" : templateID})
    if(!emailTemplate){
        throw new AppError("Template not found.", EC.NOT_FOUND)
    }
    emailTemplate.isDeleted = true
    emailTemplate.updated = new Date()
    return await emailTemplate.save()
}

emailTemplatesSchema.statics.approvedTemplate = async (user,templateID) => {
    let emailTemplate = await EmailTemplatesModel.findOne({"_id" : templateID})
    if(!emailTemplate){
        throw new AppError("Template not found.", EC.NOT_FOUND)
    }
    emailTemplate.approvedBy = user
    emailTemplate.status = "Approved"
    emailTemplate.updated = new Date()
    return await emailTemplate.save()
}

emailTemplatesSchema.statics.getAllTemplates = async (user) => {
    return await EmailTemplatesModel.find({})
}

emailTemplatesSchema.statics.isExistThisTemplateName = async (templateName) => {
    let isExistThisTemplateName = false
    let condition = {templateName:{'$regex' : '^'+templateName+'$', '$options' : 'i'}}
    let emailTemplate = await EmailTemplatesModel.find(condition)
    if(emailTemplate && emailTemplate.length>0){
        isExistThisTemplateName = true
    }
    return isExistThisTemplateName
}

const EmailTemplatesModel = mongoose.model("emailTemplate", emailTemplatesSchema)
export default EmailTemplatesModel

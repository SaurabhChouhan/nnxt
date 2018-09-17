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
    //templateHeader: String,
    templateBody: String,
    //templateFooter: String,
    templateType: String,
    status:String, //Pending, Approved
    isDeleted: {type: Boolean,default:false},

    created:{type: Date,default:new Date()},
    updated:{type: Date,default:new Date()},
})

emailTemplatesSchema.statics.addTemplate = async (user,templateInfoDataObj) => {
    let templateType = await MDL.EmailTemplateTypeModel.findOne({
        _id: templateInfoDataObj.templateType
    })
    console.log("templateType", templateType)
    if(!templateType) {
        throw new AppError("Template Type not found.", EC.NOT_FOUND)
    }
    let emailTemplate = {
        createdBy: user,
        templateName:templateInfoDataObj.templateName,
        templateSubject:templateInfoDataObj.templateSubject,
        //templateHeader:templateInfoDataObj.templateHeader,
        templateBody: templateInfoDataObj.templateBody,
       // templateFooter : templateInfoDataObj.templateFooter,
        templateType : templateType.name,
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
    let templateType = await MDL.EmailTemplateTypeModel.findOne({
        _id: templateInfoDataObj.templateType
    })

    if(!templateType) {
        throw new AppError("Template Type not found.", EC.NOT_FOUND)
    }
    //emailTemplate.createdBy =  user,
    emailTemplate.templateName = templateInfoDataObj.templateName,
    emailTemplate.templateSubject = templateInfoDataObj.templateSubject
    //emailTemplate.templateHeader = templateInfoDataObj.templateHeader
    emailTemplate.templateBody = templateInfoDataObj.templateBody
    //emailTemplate.templateFooter = templateInfoDataObj.templateFooter
    emailTemplate.templateType = templateType.name
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
    emailTemplate.status = (emailTemplate.status == "Approved") ? "Pending" : "Approved"
    emailTemplate.updated = new Date()
    return await emailTemplate.save()
}

emailTemplatesSchema.statics.getAllTemplates = async (user,type) => {
    let condition = {isDeleted : false}
    if(type && type !='undefined')
        condition.templateType = type

    console.log("getAllTemplates with condition ",condition)
    return await EmailTemplatesModel.find(condition)
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

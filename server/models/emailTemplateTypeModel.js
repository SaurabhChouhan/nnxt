import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as MDL from "../models"
import moment from 'moment'
import * as SC from "../serverconstants"

import momentTZ from 'moment-timezone'

mongoose.Promise = global.Promise

let emailTemplateTypeSchema = mongoose.Schema({
    templateTypeName: {type: String, unique : true , required: [true, 'Template type name is required']},
    isDeleted: {type: Boolean,default:false},
    status:"Approved",
    created:{type: Date,default:new Date()},
    updated:{type: Date,default:new Date()},
})

emailTemplateTypeSchema.statics.addTemplateType = async (user,templateTypeObj) => {
    let emailTemplateType = {
        templateTypeName:templateTypeObj.templateTypeName,
        status:"Approved",
        isDeleted:false,
        created:new Date(),
        updated:new Date()
    }
    return await EmailTemplateTypeModel.create(emailTemplateType)
}

emailTemplateTypeSchema.statics.getAllTemplateTypes = async (user) => {
    return await EmailTemplateTypeModel.find({})
}

const EmailTemplateTypeModel = mongoose.model("emailTemplateType", emailTemplateTypeSchema)
export default EmailTemplateTypeModel

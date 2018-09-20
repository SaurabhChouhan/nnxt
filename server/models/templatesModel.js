import mongoose from 'mongoose'
import AppError from '../AppError'
import * as EC from '../errorcodes'
import * as SC from '../serverconstants'
import {userHasRole} from "../utils";

mongoose.Promise = global.Promise
let templatesSchema = mongoose.Schema({
    name: {type: String, unique: true, required: [true, 'Template name is required']},
    body: String,
    createdBy: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String},
        lastName: {type: String}
    },
    updatedBy: {
        _id: mongoose.Schema.ObjectId,
        firstName: {type: String},
        lastName: {type: String}
    },
    created: {type: Date, default: new Date()},
    updated: {type: Date, default: new Date()},
    supportedTokens: [String]
})

/*
This method would be called by super admin
 */
templatesSchema.statics.addTemplate = async (user, templateData) => {
    if (!userHasRole(user, SC.ROLE_SUPER_ADMIN)) {
        throw new AppError('Only user with role as [' + SC.ROLE_SUPER_ADMIN + "] can add template")
    }

    let emailTemplate = {
        createdBy: user,
        name: templateData.name,
        body: templateData.body,
        created: new Date(),
        updated: new Date(),
        supportedTokens: templateData.supportedTokens
    }
    return await TemplateModel.create(emailTemplate)
}

templatesSchema.statics.deleteTemplate = async (user, templateID) => {
    if (!userHasRole(user, SC.ROLE_SUPER_ADMIN)) {
        throw new AppError('Only user with role as [' + SC.ROLE_SUPER_ADMIN + "] can add template")
    }

    let emailTemplate = await TemplateModel.findOne({"_id": templateID})
    if (!emailTemplate) {
        throw new AppError("Template not found.", EC.NOT_FOUND)
    }
    return await emailTemplate.remove()
}

templatesSchema.statics.updateTemplate = async (user, templateData) => {
    let emailTemplate = await TemplateModel.findOne({"_id": templateData._id})
    if (!emailTemplate) {
        throw new AppError("Template not found.", EC.NOT_FOUND)
    }
    emailTemplate.body = templateData.body
    emailTemplate.updated = new Date()
    emailTemplate.updateBy = user
    return await emailTemplate.save()
}

templatesSchema.statics.getAllTemplates = async () => {
    return await TemplateModel.find()
}

templatesSchema.statics.exists = async (name) => {
    let count = await TemplateModel.count({name: name})
    if (count > 0)
        return true;
    return false;
}

const TemplateModel = mongoose.model("template", templatesSchema)
export default TemplateModel

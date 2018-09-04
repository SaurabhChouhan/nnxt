import fs  from 'fs'
import path  from 'path'
import * as CONSTANT from '/server/serverconstants'
import emailTemplateReplaceAll from 'string-template'

const getEmailTemplateAfterReplaceEmailData = async (emailTemplate,emailData) =>{
    let emailTemplateString = '<div>' +emailTemplate.templateHeader + emailTemplate.templateBody + emailTemplate.templateFooter+ '</div>'
    return new Promise((res, rej) => {
       let afterReplaceEmailTemplate = emailTemplateReplaceAll(emailTemplateString, emailData)
       if(afterReplaceEmailTemplate)
           res(afterReplaceEmailTemplate)
       else
           rej("Template not found or maybe some technical issue error.")
    });
}

module.exports = {
    getEmailTemplateAfterReplaceEmailData,
}


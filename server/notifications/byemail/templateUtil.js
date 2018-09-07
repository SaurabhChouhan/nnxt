import fs  from 'fs'
import path  from 'path'
import emailTemplateReplaceAll from 'string-template'

const getEmailTemplateAfterReplaceEmailData = async (emailTemplate,emailData) =>{
    return new Promise((res, rej) => {
       let emailTemplateString = '<div>' +emailTemplate.templateHeader + emailTemplate.templateBody + emailTemplate.templateFooter+ '</div>'
       let afterReplaceEmailTemplate = emailTemplateReplaceAll(emailTemplateString, emailData)
       if(afterReplaceEmailTemplate) {
           res(afterReplaceEmailTemplate)
       }else {
           console.log("ERROR : Template data replace time error or maybe some technical issue error.")
           rej("false")
       }
    });
}

module.exports = {
    getEmailTemplateAfterReplaceEmailData,
}


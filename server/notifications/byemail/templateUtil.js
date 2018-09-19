import fs  from 'fs'
import path  from 'path'
import emailTemplateReplaceAll from 'string-template'
import * as CONSTANT from '../../serverconstants'


const getEmailTemplateAfterReplaceEmailData = async (emailTemplate,emailData) =>{
    return new Promise((res, rej) => {
       let emailTemplateString = '<div>' +CONSTANT.EMAIl_HEADR_TEMPLATE + emailTemplate.templateBody + CONSTANT.EMAIl_TEMPLATE_FOOTER+ '</div>'
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


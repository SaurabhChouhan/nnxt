import emailTemplateReplaceAll from 'string-template'
import * as CONSTANT from '../../serverconstants'

export const performTokenReplacement = async (emailTemplate, emailData) =>{
    let emailTemplateString = '<div>' +CONSTANT.EMAIl_HEADR_TEMPLATE + emailTemplate.templateBody + CONSTANT.EMAIl_TEMPLATE_FOOTER+ '</div>'
    let afterReplaceEmailTemplate = emailTemplateReplaceAll(emailTemplateString, emailData)
    if(afterReplaceEmailTemplate) {
        return afterReplaceEmailTemplate
    }else {
        console.log("ERROR : Template data replace time error or maybe some technical issue error.")
        return false
    }
}

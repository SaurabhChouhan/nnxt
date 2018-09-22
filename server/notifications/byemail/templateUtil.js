import emailTemplateReplaceAll from 'string-template'
import * as CONSTANT from '../../serverconstants'

export const performTokenReplacement = (template, data) => {
    return emailTemplateReplaceAll(template, data)
}

export const getEmailBodyWithHeaderFooter = (template, data) => {
    let emailTemplateString = '<div>' + CONSTANT.EMAIl_HEADR_TEMPLATE + template + CONSTANT.EMAIl_TEMPLATE_FOOTER + '</div>'
    let afterReplaceEmailTemplate = emailTemplateReplaceAll(emailTemplateString, data)
    if (afterReplaceEmailTemplate) {
        return afterReplaceEmailTemplate
    } else {
        console.log("ERROR : Template data replace time error or maybe some technical issue error.")
        return false
    }

}

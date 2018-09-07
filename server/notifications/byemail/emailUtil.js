import TemplateUtilObj  from './templateUtil'
import EmailSendBySES from './email-send-by-ses'
import * as CONSTANT from '../../serverconstants'
import EmailTemplatesModel from '../../models/emailTemplatesModel'
import EmailTemplateSendHistoryModel from '../../models/emailTemplateSendHistoryModel'

//Send email
const sendEmail = async (emailData,templateName) =>{

    console.log("Please wait... email is sending...........")
    let emailTemplate = await EmailTemplatesModel.findOne({"templateName" : templateName,"status" : "Approved","isDeleted" :false})
        if(emailTemplate && emailTemplate.templateName == templateName) {
            let templateUpdateWithDataJson = {
                userName: emailData.firstName +' '+emailData.lastName,
                userWelcomeMessage: emailData.userWelcomeMessage,
                NNXT_LOGO_URL:CONSTANT.NNXT_LOGO_URL,
                COPY_RIGHT_FOOTER_MESSAGE:CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
            }
            let welcomeEmailTemplatePromise = await TemplateUtilObj.getEmailTemplateAfterReplaceEmailData(emailTemplate,templateUpdateWithDataJson)
            welcomeEmailTemplatePromise.then(welcomeEmailTemplate => {
                let to = [emailData.to]
                let subject = emailTemplate.templateSubject
                let message = welcomeEmailTemplate
                let sent_type = 'Welcome to user'
                let emailSendResultPromise = EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type)
                //console.log("emailSendResultPromise...........", emailSendResultPromise)
                emailSendResultPromise.then(emailSendResult => {
                   console.log("WELCOME_EMAIL_TEMPLATE status ",emailSendResult); // Success!
                   if(emailSendResult)
                        res(true)
                    else
                       res(false)
                   }, reason => {
                        console.log("WELCOME_EMAIL_TEMPLATE ",reason); // Error!
                        rej(false)
                });
                }, reason => {
                    console.log("WELCOME_EMAIL_TEMPLATE ",reason); // Error!
                    rej(false)
                });
        }else{
            console.log("Template not found in DB.")
            return false
        }
}




module.exports = {
    sendEmail
}
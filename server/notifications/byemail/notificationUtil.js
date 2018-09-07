import TemplateUtilObj  from './templateUtil'
import EmailSendBySES from './emailSendSesUtil'
import * as CONSTANT from '../../serverconstants'
import EmailTemplatesModel from '../../models/emailTemplatesModel'
import NotificationModel from '../../models/notificationModel'

//Send email
const sendEmail = async (emailData,templateName) =>{
    console.log("Please wait...")
    console.log("Email is sending.....")
    return new Promise(async (res, rej) => {
        let emailTemplate = await EmailTemplatesModel.findOne({"templateName": templateName, "status": "Approved", "isDeleted": false})
        if (emailTemplate && emailTemplate.templateName == templateName) {

            let templateUpdateWithDataJson = {
                userName: emailData.user.firstName + ' ' + emailData.user.lastName,
                userWelcomeMessage: emailData.userWelcomeMessage,
                NNXT_LOGO_URL: CONSTANT.NNXT_LOGO_URL,
                COPY_RIGHT_FOOTER_MESSAGE: CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
            }

            //Template data replace method
            TemplateUtilObj.getEmailTemplateAfterReplaceEmailData(emailTemplate,
                templateUpdateWithDataJson).then(async welcomeEmailTemplate => {
                let to = [emailData.user.email]
                let subject = emailTemplate.templateSubject
                let message = welcomeEmailTemplate
                let sent_type = 'Welcome to nnxt'

                let notificationData ={
                    from:CONSTANT.NNXT_SELF_USER_AND_EMAIL_INFO,
                    to:emailData.user,
                    notificationSendBy:"Email",
                    notificationSubject:emailTemplate.templateSubject,
                    notificationType:"Welcome",
                    notificationBody:welcomeEmailTemplate,
                    status:"Pending"
                }
                //Save email notification into DB
                let notificationObj = await NotificationModel.addNotification(notificationData)

                //send Email method
                EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type).then(async emailSendResult => {
                    console.log("WELCOME_EMAIL_TEMPLATE status = ", emailSendResult); // Success!
                    if (emailSendResult) {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id,"Sent")
                        res(true)
                    }else {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id,"Failed")
                        res(false)
                    }
                }, async reason => {
                    await NotificationModel.updateNotificationStatusByID(notificationObj._id,"Failed")
                    console.log("WELCOME_EMAIL_TEMPLATE ", reason); // Error!
                    rej(false)
                });


            }, reason => {
                console.log("WELCOME_EMAIL_TEMPLATE ", reason); // Error!
                rej(false)
            });
        } else {
            console.log("Template not found in DB.")
            rej(false)
        }
    })
}




module.exports = {
    sendEmail
}
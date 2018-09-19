import * as TemplateUtil from './templateUtil'
import EmailSendBySES from './emailSendSesUtil'
import * as CONSTANT from '../../serverconstants'
import EmailTemplatesModel from '../../models/emailTemplatesModel'
import NotificationModel from '../../models/notificationModel'
import * as GetTextMessages from '../../textMessages'

import logger from '../../logger'

export const sendEmailNotification = async (toList, templateName, data) => {
    let emailTemplate = await EmailTemplatesModel.findOne({
        "templateName": templateName,
        "status": "Approved",
        "isDeleted": false
    })

    if (emailTemplate) {
        let body = await TemplateUtil.getEmailBodyWithHeaderFooter(emailTemplate.templateBody, data);
        let subject = await TemplateUtil.performTokenReplacement(emailTemplate.templateSubject, data);
        // Not waiting for anything as error while sending notifications would just be noted
        EmailSendBySES.sendEmailByAWSsES(toList, subject, body).catch(() => {
            logger.error("Problem sending email with template as [" + templateName)
        })
    } else {
        logger.error("Template [" + templateName + "] not found or is not approved yet.")
    }
}

//Send sendNotification
export const sendNotification = async (emailData, templateName) => {
    console.log("Please wait...")
    console.log("Email is sending.....")
    return new Promise(async (res, rej) => {
        let emailTemplate = await EmailTemplatesModel.findOne({
            "templateName": templateName,
            "status": "Approved",
            "isDeleted": false
        })
        if (!emailTemplate) {
            console.log("Template not found in DB.")
            rej(false)
        } else {

            if (templateName == CONSTANT.WELCOME_TEMPLATE) {
                //Set template json
                let templateUpdateWithDataJson = {
                    userName: emailData.user.firstName + ' ' + emailData.user.lastName,
                    userWelcomeMessage: GetTextMessages.getWelcomeTemplateMessage(),
                    NNXT_LOGO_URL: CONSTANT.NNXT_LOGO_URL,
                    COPY_RIGHT_FOOTER_MESSAGE: CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
                }

                //Template data replace method
                TemplateUtil.performTokenReplacement(emailTemplate,
                    templateUpdateWithDataJson).then(async welcomeEmailTemplate => {
                    let to = [emailData.user.email]
                    let subject = emailTemplate.templateSubject
                    let message = welcomeEmailTemplate
                    let sent_type = 'Welcome to nnxt'

                    //set notification json
                    let notificationData = {
                        from: CONSTANT.NNXT_SELF_USER_AND_EMAIL_INFO,
                        to: emailData.user,
                        notificationSendBy: "Email",
                        notificationSubject: emailTemplate.templateSubject,
                        notificationType: "Welcome",
                        notificationBody: welcomeEmailTemplate,
                        notificationBodyText: GetTextMessages.getWelcomeTemplateMessage(),
                        status: "Pending"
                    }
                    //Save email notification into DB
                    let notificationObj = await NotificationModel.addNotification(notificationData)

                    //send Email request method to AWS SES
                    EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type).then(async emailSendResult => {
                        console.log("WELCOME_EMAIL_TEMPLATE status = ", emailSendResult); // Success!
                        if (emailSendResult) {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Sent")
                            res(true)
                        } else {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                            res(false)
                        }
                    }, async reason => {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                        console.log("WELCOME_EMAIL_TEMPLATE ", reason); // Error!
                        rej(false)
                    });


                }, reason => {
                    console.log("WELCOME_EMAIL_TEMPLATE ", reason); // Error!
                    rej(false)
                });
            } else if (templateName == CONSTANT.OTP_TEMPLATE) {

                //Set template json
                let templateUpdateWithDataJson = {
                    userName: emailData.user.firstName + ' ' + emailData.user.lastName,
                    OTPMessage: GetTextMessages.getOTPmessage({otp: emailData.OTP}),
                    NNXT_LOGO_URL: CONSTANT.NNXT_LOGO_URL,
                    COPY_RIGHT_FOOTER_MESSAGE: CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
                }

                //Template data replace method
                TemplateUtil.performTokenReplacement(emailTemplate,
                    templateUpdateWithDataJson).then(async welcomeEmailTemplate => {
                    let to = [emailData.user.email]
                    let subject = emailTemplate.templateSubject
                    let message = welcomeEmailTemplate
                    let sent_type = 'For OTP'

                    //set notification json
                    let notificationData = {
                        from: CONSTANT.NNXT_SELF_USER_AND_EMAIL_INFO,
                        to: emailData.user,
                        notificationSendBy: "Email",
                        notificationSubject: emailTemplate.templateSubject,
                        notificationType: "OTP",
                        notificationBody: welcomeEmailTemplate,
                        notificationBodyText: GetTextMessages.getOTPmessage({otp: emailData.OTP}),
                        status: "Pending"
                    }
                    //Save email notification into DB
                    let notificationObj = await NotificationModel.addNotification(notificationData)

                    //send Email request method to AWS SES
                    EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type).then(async emailSendResult => {
                        console.log("OTP_TEMPLATE status = ", emailSendResult); // Success!
                        if (emailSendResult) {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Sent")
                            res(true)
                        } else {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                            res(false)
                        }
                    }, async reason => {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                        console.log("OTP_TEMPLATE ", reason); // Error!
                        rej(false)
                    });


                }, reason => {
                    console.log("OTP_TEMPLATE ", reason); // Error!
                    rej(false)
                });
            } else if (templateName == CONSTANT.RESET_PASSWORD_TEMPLATE) {

                //Set template json
                let templateUpdateWithDataJson = {
                    userName: emailData.user.firstName + ' ' + emailData.user.lastName,
                    resetPasswordMessage: GetTextMessages.getResetPasswordMessage(),
                    NNXT_LOGO_URL: CONSTANT.NNXT_LOGO_URL,
                    COPY_RIGHT_FOOTER_MESSAGE: CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
                }

                //Template data replace method
                TemplateUtil.performTokenReplacement(emailTemplate,
                    templateUpdateWithDataJson).then(async welcomeEmailTemplate => {
                    let to = [emailData.user.email]
                    let subject = emailTemplate.templateSubject
                    let message = welcomeEmailTemplate
                    let sent_type = 'For reset password'

                    //set notification json
                    let notificationData = {
                        from: CONSTANT.NNXT_SELF_USER_AND_EMAIL_INFO,
                        to: emailData.user,
                        notificationSendBy: "Email",
                        notificationSubject: emailTemplate.templateSubject,
                        notificationType: "Reset-Password",
                        notificationBody: welcomeEmailTemplate,
                        notificationBodyText: GetTextMessages.getResetPasswordMessage(),
                        status: "Pending"
                    }
                    //Save email notification into DB
                    let notificationObj = await NotificationModel.addNotification(notificationData)

                    //send Email request method to AWS SES
                    EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type).then(async emailSendResult => {
                        console.log("RESET_PASSWORD_TEMPLATE status = ", emailSendResult); // Success!
                        if (emailSendResult) {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Sent")
                            res(true)
                        } else {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                            res(false)
                        }
                    }, async reason => {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                        console.log("RESET_PASSWORD_TEMPLATE ", reason); // Error!
                        rej(false)
                    });


                }, reason => {
                    console.log("RESET_PASSWORD_TEMPLATE ", reason); // Error!
                    rej(false)
                });
            } else if (templateName == CONSTANT.RAISE_LEAVE_TEMPLATE) {

                //Set template json
                let templateUpdateWithDataJson = {
                    userName: emailData.admin.firstName + ' ' + emailData.admin.lastName,
                    raiseLeaveMessage: GetTextMessages.getRaisedLeaveMessage({
                        userName: emailData.user.firstName + ' ' + emailData.user.lastName,
                        leaveType: emailData.leaveType,
                        startDate: emailData.startDate,
                        endDate: emailData.endDate,
                        leaveDescription: emailData.leaveDescription
                    }),
                    NNXT_LOGO_URL: CONSTANT.NNXT_LOGO_URL,
                    COPY_RIGHT_FOOTER_MESSAGE: CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
                }

                //Template data replace method
                TemplateUtil.performTokenReplacement(emailTemplate,
                    templateUpdateWithDataJson).then(async welcomeEmailTemplate => {
                    let to = [emailData.admin.email]
                    let subject = emailTemplate.templateSubject
                    let message = welcomeEmailTemplate
                    let sent_type = 'Raise-Leave'

                    //set notification json
                    let notificationData = {
                        from: CONSTANT.NNXT_SELF_USER_AND_EMAIL_INFO,
                        to: emailData.admin,
                        notificationSendBy: "Email",
                        notificationSubject: emailTemplate.templateSubject,
                        notificationType: "Raise-Leave",
                        notificationBody: welcomeEmailTemplate,
                        notificationBodyText: GetTextMessages.getRaisedLeaveMessage({
                            userName: emailData.admin.firstName + ' ' + emailData.admin.lastName,
                            leaveType: emailData.leaveType,
                            startDate: emailData.startDate,
                            endDate: emailData.endDate,
                            leaveDescription: emailData.leaveDescription
                        }),
                        status: "Pending"
                    }
                    //Save email notification into DB
                    let notificationObj = await NotificationModel.addNotification(notificationData)

                    //send Email request method to AWS SES
                    EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type).then(async emailSendResult => {
                        console.log("RAISE_LEAVE_TEMPLATE status = ", emailSendResult); // Success!
                        if (emailSendResult) {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Sent")
                            res(true)
                        } else {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                            res(false)
                        }
                    }, async reason => {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                        console.log("RAISE_LEAVE_TEMPLATE ", reason); // Error!
                        rej(false)
                    });


                }, reason => {
                    console.log("RAISE_LEAVE_TEMPLATE ", reason); // Error!
                    rej(false)
                });
            } else if (templateName == CONSTANT.APPROVED_LEAVE_TEMPLATE) {

                //Set template json
                let templateUpdateWithDataJson = {
                    userName: emailData.user.firstName + ' ' + emailData.user.lastName,
                    approvedLeaveMessage: GetTextMessages.getApprovedLeaveMessage({reason: emailData.reason}),
                    NNXT_LOGO_URL: CONSTANT.NNXT_LOGO_URL,
                    COPY_RIGHT_FOOTER_MESSAGE: CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
                }

                //Template data replace method
                TemplateUtil.performTokenReplacement(emailTemplate,
                    templateUpdateWithDataJson).then(async welcomeEmailTemplate => {
                    let to = [emailData.user.email]
                    let subject = emailTemplate.templateSubject
                    let message = welcomeEmailTemplate
                    let sent_type = 'Approved-Raise-Leave'

                    //set notification json
                    let notificationData = {
                        from: CONSTANT.NNXT_SELF_USER_AND_EMAIL_INFO,
                        to: emailData.user,
                        notificationSendBy: "Email",
                        notificationSubject: emailTemplate.templateSubject,
                        notificationType: "Approved-Raise-Leave",
                        notificationBody: welcomeEmailTemplate,
                        notificationBodyText: GetTextMessages.getApprovedLeaveMessage({reason: emailData.reason}),
                        status: "Pending"
                    }
                    //Save email notification into DB
                    let notificationObj = await NotificationModel.addNotification(notificationData)

                    //send Email request method to AWS SES
                    EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type).then(async emailSendResult => {
                        console.log("APPROVED_LEAVE_TEMPLATE status = ", emailSendResult); // Success!
                        if (emailSendResult) {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Sent")
                            res(true)
                        } else {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                            res(false)
                        }
                    }, async reason => {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                        console.log("APPROVED_LEAVE_TEMPLATE ", reason); // Error!
                        rej(false)
                    });


                }, reason => {
                    console.log("APPROVED_LEAVE_TEMPLATE ", reason); // Error!
                    rej(false)
                });
            } else if (templateName == CONSTANT.REJECT_RAISED_LEAVE_TEMPLATE) {

                //Set template json
                let templateUpdateWithDataJson = {
                    userName: emailData.user.firstName + ' ' + emailData.user.lastName,
                    rejectRaisedLeaveMessage: GetTextMessages.getRejectLeaveMessage({reason: emailData.reason}),
                    NNXT_LOGO_URL: CONSTANT.NNXT_LOGO_URL,
                    COPY_RIGHT_FOOTER_MESSAGE: CONSTANT.COPY_RIGHT_FOOTER_MESSAGE
                }

                //Template data replace method
                TemplateUtil.performTokenReplacement(emailTemplate,
                    templateUpdateWithDataJson).then(async welcomeEmailTemplate => {
                    let to = [emailData.user.email]
                    let subject = emailTemplate.templateSubject
                    let message = welcomeEmailTemplate
                    let sent_type = 'Reject-Raise-Leave'

                    //set notification json
                    let notificationData = {
                        from: CONSTANT.NNXT_SELF_USER_AND_EMAIL_INFO,
                        to: emailData.user,
                        notificationSendBy: "Email",
                        notificationSubject: emailTemplate.templateSubject,
                        notificationType: "Reject-Raise-Leave",
                        notificationBody: welcomeEmailTemplate,
                        notificationBodyText: GetTextMessages.getRejectLeaveMessage({reason: emailData.reason}),
                        status: "Pending"
                    }
                    //Save email notification into DB
                    let notificationObj = await NotificationModel.addNotification(notificationData)

                    //send Email request method to AWS SES
                    EmailSendBySES.sendEmailByAWSsES(to, subject, message, sent_type).then(async emailSendResult => {
                        console.log("REJECT_RAISED_LEAVE_TEMPLATE status = ", emailSendResult); // Success!
                        if (emailSendResult) {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Sent")
                            res(true)
                        } else {
                            await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                            res(false)
                        }
                    }, async reason => {
                        await NotificationModel.updateNotificationStatusByID(notificationObj._id, "Failed")
                        console.log("REJECT_RAISED_LEAVE_TEMPLATE ", reason); // Error!
                        rej(false)
                    });


                }, reason => {
                    console.log("REJECT_RAISED_LEAVE_TEMPLATE ", reason); // Error!
                    rej(false)
                });
            }


            else {
                console.log("Template not found in DB.")
                rej(false)
            }
        }//end of else
    })
}
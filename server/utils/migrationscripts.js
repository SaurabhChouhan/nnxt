import * as MDL from "../models"
import * as TC from '../templateconsts'
import logger from '../logger'

// For email/notification template feature
export const addNNXTTemplates = async () => {
    // Find super admin user as only he can create templates
    let superAdminUser = await MDL.UserModel.findOne({email: 'superadmin@aripratech.com'})
    logger.debug("addTemplate: ", {superAdminUser: superAdminUser.roles})
    if (superAdminUser) {
        // create template only if super admin user is found
        if (!await MDL.TemplateModel.exists(TC.EMAIL_BODY_LEAVE_RAISED)) {
            await MDL.TemplateModel.addTemplate(superAdminUser, {
                name: TC.EMAIL_BODY_LEAVE_RAISED,
                body: `<p>Hi,</p><p>{firstName} {lastName} has raised a leave from {fromDate} to {toDate}.</p> <p>Leave type is chosen as '{leaveType}' with description given as 
                     '{leaveDescription}</p><p>Regards, <br/>NNXT Team.</p>
                        `,
                supportedTokens: [
                    'firstName', 'lastName', 'fromDate', 'toDate', 'leaveType', 'leaveDescription'
                ]
            })
        }

        if (!await MDL.TemplateModel.exists(TC.EMAIL_SUBJECT_LEAVE_RAISED)) {
            await MDL.TemplateModel.addTemplate(superAdminUser, {
                name: TC.EMAIL_SUBJECT_LEAVE_RAISED,
                body: `{firstName} has raised a leave`,
                supportedTokens: [
                    'firstName', 'lastName', 'fromDate', 'toDate', 'leaveType', 'leaveDescription', 'leaveID', 'employeeID'
                ]
            })
        }

        if (!await MDL.TemplateModel.exists(TC.NOTIFICATION_LEAVE_RAISED)) {
            await MDL.TemplateModel.addTemplate(superAdminUser, {
                name: TC.NOTIFICATION_LEAVE_RAISED,
                body: `{firstName} has raised a leave from {fromDate} to {toDate}`,
                supportedTokens: [
                    'firstName', 'lastName', 'fromDate', 'toDate', 'leaveType', 'leaveDescription'
                ]
            })
        }

    } else {
        logger.error("No super admin user found")
    }
}
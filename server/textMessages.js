import compile from 'string-template/compile'
import * as CONSTANT from './serverconstants'

/*Basic email message*/
export const getWelcomeTemplateMessage = compile("Welcome To NNXT",true);
export const getOTPmessage = compile("Your NNXT OTP is  {otp}",true);
export const getResetPasswordMessage = compile("Your password has been reset successfully.",true);
/*Leaves email message*/
export const getRaisedLeaveMessage = compile("Hi Sir,  {userName} employee want to leave and type is {leaveType} and start date : {startDate} from end date : {endDate} with {leaveDescription}",true);
export const getApprovedLeaveMessage = compile("Your leave has been approved by Aripra Management Team reason is ( {reason} ).",true);
export const getRejectLeaveMessage = compile("Your leave has been rejected due to some reason ( {reason} ). Please contact to Aripra Management Team.",true);
/*Reporting email message*/
export const getCompleteMarkReportingAlertMessage = compile("Your Tasks reported Completed and tasks details are as follows... {taskDetails}",true);
export const getPendingMarkReportingAlertMessage = compile("NNXT Tasks reported pending and tasks details are as follows... {taskDetails}",true);
export const getUnReportedTaskAlertMessage = compile("Please report your Un-Reported tasks. If already reported then ignore it.",true);
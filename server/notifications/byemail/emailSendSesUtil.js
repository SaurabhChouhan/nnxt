import AWS  from 'aws-sdk'
AWS.config.loadFromPath("./aws_for_ses.json")
import {SENDER_EMAIL_ADDRESS}  from '../../serverconstants'

// load AWS SES
//var ses = new AWS.SES({apiVersion: '2010-12-01'});
const ses = new AWS.SES()

const sendEmailByAWSsES = (to,subject,message,sent_type)=> {
  return  new Promise((res, rej) => {
        let from = SENDER_EMAIL_ADDRESS
     // to = [SENDER_EMAIL_ADDRESS]
        // this sends the email
        ses.sendEmail({
                Source: from,
                Destination: {ToAddresses: to},
                Message: {
                    Subject: {
                        Data: subject
                    },
                    Body: {
                        /*Text: {
                            Data: message,
                        },*/
                        Html: {
                            Data: message,
                        }
                    }
                }
            }
            , function (err, data) {

                if (err) {
                    //return false
                    console.log("sendEmailByAWSsES ",err)
					res(false)
                } else {
                    //return true
					res(true)
                }
            });
    })
}


module.exports = {
    sendEmailByAWSsES
}
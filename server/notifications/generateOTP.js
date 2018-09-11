import * as MDL from "../models/index"
import * as CC from '../../client/clientconstants'
import * as SC from '../serverconstants'
import momentTZ from 'moment-timezone'
import logger from '../logger'

const generateNewOTP = async () => {
        let otp = null;
        try {
            otp = Math.floor(Math.random() * (900000)) + 100000;
        } catch (e) {
            otp = null;
            console.log("ERROR : for generate New OTP " + e);
        }
    console.log("Success : generated New OTP : " + otp);
    return otp
}


module.exports = {
    generateNewOTP
}
import mongoose from 'mongoose'
import AppError from '../AppError'
import * as SC from '../serverconstants'
import * as EC from '../errorcodes'
import {userHasRole} from "../utils"
import * as V from '../validation'

mongoose.Promise = global.Promise

let employeeSettingSchema = mongoose.Schema({

    minPlannedHours: {type: Number, default: 4},
    maxPlannedHours: {type: Number, default: 8},
    free: {type: Number, default: 1},
    relativelyFree: {type: Number, default: 3},
    someWhatBusy: {type: Number, default: 5},
    busy: {type: Number, default: 7},
    superBusy: {type: Number, default: 10}
})

/**
 * Employee Setting is Created by Admin
 * @param employeeSettingInput
 */
employeeSettingSchema.statics.createEmployeeSettings = async (employeeSettingInput, user, schemaRequested) => {
    if (schemaRequested)
        return V.generateSchema(V.employeeCreateSettingStruct)

    V.validate(employeeSettingInput, V.employeeCreateSettingStruct)
    return await EmployeeSettingModel.create(employeeSettingInput)
}
/**
 * Employee Setting is fetched
 */
employeeSettingSchema.statics.getEmployeeSettings = async (user) => {
    if (!user || !(userHasRole(user, SC.ROLE_ADMIN) || userHasRole(user, SC.ROLE_MANAGER) || userHasRole(user, SC.ROLE_LEADER)))
        throw new AppError('Not allowed to get information on role with [' + SC.ROLE_ADMIN + "or" + SC.ROLE_MANAGER + "or" + SC.ROLE_LEADER + '] can get employee details', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let employeeSettings = await EmployeeSettingModel.find({})
    return employeeSettings && employeeSettings.length ? employeeSettings[0] : {}
}
/**
 * Employee Setting is updated by Admin
 * @param employeeSettingInput
 */
employeeSettingSchema.statics.updateEmployeeSettings = async (employeeSettingInput, admin, schemaRequested) => {
    if (schemaRequested)
        return V.generateSchema(V.employeeUpdateSettingStruct)

    V.validate(employeeSettingInput, V.employeeUpdateSettingStruct)
    if (!admin || !userHasRole(admin, SC.ROLE_ADMIN))
        throw new AppError('Not a Admin', EC.INVALID_USER, EC.HTTP_BAD_REQUEST)

    let employeeSetting = await EmployeeSettingModel.findById(mongoose.Types.ObjectId(employeeSettingInput._id))
    if (!employeeSetting) {
        throw new AppError('employeeSetting  not found', EC.NOT_FOUND, EC.HTTP_BAD_REQUEST)
    }
    employeeSetting.maxPlannedHours = employeeSettingInput.maxPlannedHours
    employeeSetting.minPlannedHours = employeeSettingInput.minPlannedHours
    employeeSetting.free = employeeSettingInput.free
    employeeSetting.relativelyFree = employeeSettingInput.relativelyFree
    employeeSetting.someWhatBusy = employeeSettingInput.someWhatBusy
    employeeSetting.busy = employeeSettingInput.busy
    employeeSetting.superBusy = employeeSettingInput.superBusy
    return await employeeSetting.save()
}


const EmployeeSettingModel = mongoose.model("employeeSetting", employeeSettingSchema)
export default EmployeeSettingModel
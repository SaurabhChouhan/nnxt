import mongoose from 'mongoose'
import * as EC from "../errorcodes"
import AppError from '../AppError'
import * as MDL from '../models'

mongoose.Promise = global.Promise

let permissionSchema = mongoose.Schema({
    name: String
})


permissionSchema.statics.getAll = async () => {
    return await PermissionModel.find({})
}


permissionSchema.statics.savePermission = async permissionInput => {
    if (!permissionInput.name)
        throw new AppError("permission missing", EC.HTTP_BAD_REQUEST)


    if (await PermissionModel.exists(permissionInput.name))
        throw new AppError("Permission [" + permissionInput.name + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    return await PermissionModel.create(permissionInput)
}

permissionSchema.statics.createPermission = async permissionInput => {
    return await PermissionModel.create(permissionInput)
}


permissionSchema.statics.editPermission = async permissionInput => {
    let permission = await PermissionModel.findById(permissionInput._id)
    let count = await PermissionModel.count({'name': permissionInput.name, '_id': {$ne: permission._id}})
    if (count > 0) {
        throw new AppError("Permission [" + permissionInput.name + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    if (permission) {
        permission.name = permissionInput.name
        let roleUpdate = await MDL.RoleModel.updateAddedPermission(permissionInput)
        return await permission.save()
    }
}


permissionSchema.statics.deletePermission = async (permissionID) => {
    if (!permissionID)
        throw new AppError("Identifier required for delete", EC.IDENTIFIER_MISSING, EC.HTTP_BAD_REQUEST)
    let roleDelete = await MDL.RoleModel.deleteAddedPermission(permissionID)
    return await PermissionModel.findByIdAndRemove(permissionID).exec()
}


permissionSchema.statics.exists = async name => {
    if (!name)
        return false
    let count = await PermissionModel.count({'name': name})
    if (count > 0)
        return true
    return false
}


const PermissionModel = mongoose.model("Permission", permissionSchema)
export default PermissionModel
import mongoose from 'mongoose'
import AppError from '../AppError'
import * as MDL from '../models'
import * as EC from "../errorcodes"
import * as SC from "../serverconstants"

mongoose.Promise = global.Promise

let roleSchema = mongoose.Schema({
    name: String,
    permissions: [{
        _id: mongoose.Schema.ObjectId,
        name: String,
        configurable: {type: Boolean, default: false},
        enabled: {type: Boolean, default: false}
    }]
})

roleSchema.statics.getAll = async () => {
    return await RoleModel.find({})
}

roleSchema.statics.getAllBasic = async () => {
    return await RoleModel.find({}, {name: 1})
}

roleSchema.statics.getWithConfigurablePerms = async () => {
    return await RoleModel.aggregate({
            $match: {
                'name': {$nin: [SC.ROLE_SUPER_ADMIN]}
            }
        }, {
            $project: {
                name: 1,
                permissions: {
                    $filter: {
                        input: "$permissions",
                        as: "permission",
                        cond: {$eq: ['$$permission.configurable', true]}
                    }
                }
            }
        }
    )
}

roleSchema.statics.saveRole = async (roleInput) => {
    if (await RoleModel.exists(roleInput.name)) {
        throw new AppError("Role [" + roleInput.name + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    return await RoleModel.create(roleInput)
}

roleSchema.statics.editRole = async (roleInput) => {
    if (!roleInput._id)
        throw new AppError("Identifier required for edit", EC.IDENTIFIER_MISSING, EC.HTTP_BAD_REQUEST)
    let count = await RoleModel.count({'name': roleInput.name, '_id': {$ne: roleInput._id}})
    if (count > 0) {
        throw new AppError("Role [" + roleInput.name + "] already exists", EC.ALREADY_EXISTS, EC.HTTP_BAD_REQUEST)
    }
    let userUpdate = await MDL.UserModel.updateAddedRole(roleInput)
    await RoleModel.replaceOne({_id: roleInput._id}, roleInput)
    return roleInput
}

roleSchema.statics.deleteRole = async (roleID) => {
    if (!roleID)
        throw new AppError("Identifier required for delete", EC.IDENTIFIER_MISSING, EC.HTTP_BAD_REQUEST)
    let userDelete = await MDL.UserModel.deleteAddedRole(roleID)
    return await RoleModel.findByIdAndRemove(roleID).exec()
}

roleSchema.statics.exists = async (name) => {
    let count = await RoleModel.count({name: name})
    if (count > 0)
        return true
    return false
}
roleSchema.statics.updateAddedPermission = async (permissionInput) => {
    let rolePermissionUpdate = await RoleModel.update({'permissions._id': permissionInput._id}, {$set: {'permissions.$.name': permissionInput.name}}, {multi: true}).exec()
    return rolePermissionUpdate
}
roleSchema.statics.deleteAddedPermission = async (permissionID) => {
    let rolePermissionDelete = await RoleModel.updateMany({'permissions._id': permissionID}, {$pull: {"permissions": {_id: permissionID}}}, {multi: true}).exec()
    return rolePermissionDelete
}
const RoleModel = mongoose.model("Role", roleSchema)
export default RoleModel
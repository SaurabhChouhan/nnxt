import {
    ROLE_DEVELOPER, ROLE_ESTIMATOR, ROLE_LEADER, ROLE_MANAGER, ROLE_NEGOTIATOR,
    ROLE_TOP_MANAGEMENT
} from "../server/serverconstants";

export const ROLE_ADMIN = 'admin'
export const ROLE_SUPER_ADMIN = 'super_admin'
export const ROLE_APP_USER = 'app_user'

export const DEBUG_LEVEL = 'debug'
export const INFO_LEVEL = 'info'
export const WARNING_LEVEL = 'warning'
export const ERROR_LEVEL = 'error'


export const EDIT_PROFILE = 'Edit Profile'
export const MANAGE_PERMISSIONS = 'Manage Permissions'
export const MANAGE_ROLES = 'Manage Roles'
export const CREATE_USER = 'Create User'
export const EDIT_USER = 'Edit User'
export const DELETE_USER = 'Delete User'
export const EDIT_EMAIL_TEMPLATE = 'Edit Email Template'
export const DELETE_EMAIL_TEMPLATE = 'Delete Email Template'
export const CREATE_TEMPLATE = 'Create Template'
export const LIST_USERS = 'List Users'
export const LIST_TEMPLATES = 'List Templates'
export const EDIT_ROLE_PERMISSIONS = 'Edit Role Permissions'

export const CLIENT_ARIPRA = 'Aripra'

export const TYPE_DEVELOPMENT = 'development'
export const TYPE_TESTING = 'testing'
export const TYPE_REVIEW = 'review'
export const TYPE_MANAGEMENT = 'management'
export const TYPE_COMPANY = 'company'

export const RELEASE_TYPE_CLIENT = 'Client'
export const RELEASE_TYPE_INTERNAL = 'Internal'
export const RELEASE_TYPE_TRAINING = 'Training'
export const RELEASE_TYPE_JOBS = 'Jobs'

export const PROJECT_ARIPRA_TRAINING = 'Aripra Training'
export const PROJECT_ARIPRA_BIDDING = 'Aripra Bidding'


export const RELEASE_TYPES = [
    {
        _id: RELEASE_TYPE_CLIENT,
        name: "Client Projects"
    },
    {
        _id: RELEASE_TYPE_INTERNAL,
        name: "Aripra Projects"
    },
    {
        _id: RELEASE_TYPE_TRAINING,
        name: "Training & Sessions"
    },
    {
        _id: RELEASE_TYPE_JOBS,
        name: "Bidding, Estimations & Management"

    }
]

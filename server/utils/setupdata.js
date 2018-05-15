import * as MDL from "../models"
import * as CC from '../../client/clientconstants'
import * as SC from '../serverconstants'
import logger from '../logger'

export const addInitialData = async () => {

    if (!await MDL.PermissionModel.exists(CC.MANAGE_PERMISSIONS)) {
        await MDL.PermissionModel.savePermission({
            name: CC.MANAGE_PERMISSIONS
        })
    }

    if (!await MDL.PermissionModel.exists(CC.MANAGE_ROLES)) {
        await MDL.PermissionModel.savePermission({
            name: CC.MANAGE_ROLES
        })
    }

    if (!await MDL.PermissionModel.exists(CC.LIST_USERS)) {
        await MDL.PermissionModel.savePermission({
            name: CC.LIST_USERS
        })
    }

    if (!await MDL.PermissionModel.exists(CC.EDIT_PROFILE)) {
        await MDL.PermissionModel.savePermission({
            name: CC.EDIT_PROFILE
        })
    }

    if (!await MDL.PermissionModel.exists(CC.EDIT_ROLE_PERMISSIONS)) {
        await MDL.PermissionModel.savePermission({
            name: CC.EDIT_ROLE_PERMISSIONS
        })
    }

    if (!await MDL.PermissionModel.exists(CC.CREATE_USER)) {
        await MDL.PermissionModel.savePermission({
            name: CC.CREATE_USER
        })
    }

    if (!await MDL.PermissionModel.exists(CC.EDIT_USER)) {
        await MDL.PermissionModel.savePermission({
            name: CC.EDIT_USER
        })
    }

    if (!await MDL.PermissionModel.exists(CC.DELETE_USER)) {
        await MDL.PermissionModel.savePermission({
            name: CC.DELETE_USER
        })
    }

    /**
     * Super admin can manage users/permissions and roles
     */
    if (!await MDL.RoleModel.exists(SC.ROLE_SUPER_ADMIN)) {

        let permissions = []
        let managePermissions = await MDL.PermissionModel.findOne({name: CC.MANAGE_PERMISSIONS}).lean()
        if (managePermissions) {
            managePermissions.configurable = false
            managePermissions.enabled = true
            permissions.push(managePermissions)
        }
        let manageRoles = await MDL.PermissionModel.findOne({name: CC.MANAGE_ROLES}).lean()
        if (manageRoles) {
            manageRoles.configurable = false
            manageRoles.enabled = true
            permissions.push(manageRoles)
        }
        let listUsers = await MDL.PermissionModel.findOne({name: CC.LIST_USERS}).lean()
        if (listUsers) {
            listUsers.configurable = false
            listUsers.enabled = true
            permissions.push(listUsers)
        }
        await MDL.RoleModel.saveRole({
            name: SC.ROLE_SUPER_ADMIN,
            permissions: permissions
        })
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_ADMIN)) {
        let permissions = []
        let listUsers = await MDL.PermissionModel.findOne({name: CC.LIST_USERS}).lean()
        if (listUsers) {
            listUsers.configurable = true
            listUsers.enabled = true
            permissions.push(listUsers)
        }

        let editRolePermissions = await MDL.PermissionModel.findOne({name: CC.EDIT_ROLE_PERMISSIONS}).lean()
        if (editRolePermissions) {
            editRolePermissions.configurable = true
            editRolePermissions.enabled = true
            permissions.push(editRolePermissions)
        }

        let createUserPermissions = await MDL.PermissionModel.findOne({name: CC.CREATE_USER}).lean()
        if (createUserPermissions) {
            createUserPermissions.configurable = true
            createUserPermissions.enabled = true
            permissions.push(createUserPermissions)
        }

        let editUserPermissions = await MDL.PermissionModel.findOne({name: CC.EDIT_USER}).lean()
        if (editUserPermissions) {
            editUserPermissions.configurable = true
            editUserPermissions.enabled = true
            permissions.push(editUserPermissions)
        }

        let deleteUserPermissions = await MDL.PermissionModel.findOne({name: CC.DELETE_USER}).lean()
        if (deleteUserPermissions) {
            deleteUserPermissions.configurable = true
            deleteUserPermissions.enabled = true
            permissions.push(deleteUserPermissions)
        }


        await MDL.RoleModel.saveRole({
            name: SC.ROLE_ADMIN,
            permissions: permissions
        })
    }


    /*
    if (!await MDL.RoleModel.exists(ROLE_APP_USER)) {
        let permissions = []
        let editProfile = await MDL.PermissionModel.findOne({name: EDIT_PROFILE}).lean()
        if (editProfile) {
            editProfile.configurable = true
            editProfile.enabled = true
            permissions.push(editProfile)
        }
        await MDL.RoleModel.saveRole({
            name: ROLE_APP_USER,
            permissions: permissions
        })
    }
    */

    if (!await MDL.UserModel.exists(SC.ADMIN_EMAIL)) {
        let adminRole = await MDL.RoleModel.findOne({name: SC.ROLE_ADMIN}).lean()

        // create user
        await MDL.UserModel.saveUser({
            email: SC.ADMIN_EMAIL,
            firstName: "App",
            lastName: "Admin",
            roles: [adminRole],
            password: "admin",
            employeeCode: 'emp-100',
            designation: SC.DESIGNATION_MANAGER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists(SC.SUPER_ADMIN_EMAIL)) {

        let superAdminRole = await MDL.RoleModel.findOne({name: SC.ROLE_SUPER_ADMIN}).lean()
        // create user
        await MDL.UserModel.saveUser({
            email: SC.SUPER_ADMIN_EMAIL,
            firstName: "Super",
            lastName: "Admin",
            roles: [superAdminRole],
            password: "admin",
            employeeCode: 'emp-101',
            designation: SC.DESIGNATION_MANAGER,
            dateJoined: '01-01-2018'
        })
    }

    /*
    if (!await MDL.UserModel.exists(APP_USER_EMAIL)) {
        let appUserRole = await MDL.RoleModel.findOne({name: ROLE_APP_USER}).lean()
        // create user
        await MDL.UserModel.saveUser({
            email: APP_USER_EMAIL,
            firstName: "App",
            lastName: "User",
            roles: [appUserRole],
            password: "appuser"
        })
    }
    */


}

export const addNNXTData = async () => {
    await addRolesPermissions()
    await addNNXTUsers()
    await addClients()
    await addProjects()
    await addLeaveTypes()
    await addTechnologies()
    await addRepositoryTasksAndFeatures()
}

const addRolesPermissions = async () => {
    logger.info("SETTING UP ROLES/PERMISSIONS ...")

    let editProfile = await MDL.PermissionModel.findOne({name: CC.EDIT_PROFILE}).lean()
    let permissions = []
    if (editProfile) {
        editProfile.configurable = true
        editProfile.enabled = true
        permissions.push(editProfile)
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_ESTIMATOR)) {
        await MDL.RoleModel.saveRole({
            name: SC.ROLE_ESTIMATOR,
            permissions: permissions
        })
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_NEGOTIATOR)) {
        await MDL.RoleModel.saveRole({
            name: SC.ROLE_NEGOTIATOR,
            permissions: permissions
        })
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_MANAGER)) {
        await MDL.RoleModel.saveRole({
            name: SC.ROLE_MANAGER,
            permissions: permissions
        })
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_LEADER)) {
        await MDL.RoleModel.saveRole({
            name: SC.ROLE_LEADER,
            permissions: permissions
        })
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_DEVELOPER)) {
        await MDL.RoleModel.saveRole({
            name: SC.ROLE_DEVELOPER,
            permissions: permissions
        })
    }
}

const addNNXTUsers = async () => {
    logger.info("SETTING UP USERS ...")
    let estimatorRole = await MDL.RoleModel.findOne({name: SC.ROLE_ESTIMATOR}).lean()
    // create estimator user
    if (!await MDL.UserModel.exists('estimator1@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'estimator1@test.com',
            firstName: "Estimator-1",
            lastName: "One",
            roles: [estimatorRole],
            password: "estimator",
            employeeCode: 'emp-001',
            designation: SC.DESIGNATION_TEAM_LEAD,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('estimator2@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'estimator2@test.com',
            firstName: "Estimator-2",
            lastName: "Two",
            roles: [estimatorRole],
            password: "estimator",
            employeeCode: 'emp-002',
            designation: SC.DESIGNATION_TEAM_LEAD,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('estimator3@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'estimator3@test.com',
            firstName: "Estimator-3",
            lastName: "Three",
            roles: [estimatorRole],
            password: "estimator",
            employeeCode: 'emp-003',
            designation: SC.DESIGNATION_TEAM_LEAD,
            dateJoined: '01-01-2018'
        })
    }

    let negotiatorRole = await MDL.RoleModel.findOne({name: SC.ROLE_NEGOTIATOR}).lean()
    // create negotitor user
    if (!await MDL.UserModel.exists('negotiator1@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'negotiator1@test.com',
            firstName: "Negotiator-1",
            lastName: "One",
            roles: [negotiatorRole],
            password: "negotiator",
            employeeCode: 'emp-004',
            designation: SC.DESIGNATION_MANAGER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('negotiator2@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'negotiator2@test.com',
            firstName: "Negotiator-2",
            lastName: "Two",
            roles: [negotiatorRole],
            password: "negotiator",
            employeeCode: 'emp-005',
            designation: SC.DESIGNATION_MANAGER,
            dateJoined: '01-01-2018'
        })
    }
    let managerRole = await MDL.RoleModel.findOne({name: SC.ROLE_MANAGER}).lean()
    // create manager user
    if (!await MDL.UserModel.exists('manger1@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'manager1@test.com',
            firstName: "Manager-1",
            lastName: "One",
            roles: [managerRole],
            password: "manager",
            employeeCode: 'emp-006',
            designation: SC.DESIGNATION_MANAGER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('manger2@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'manager2@test.com',
            firstName: "Manager-2",
            lastName: "Two",
            roles: [managerRole],
            password: "manager",
            employeeCode: 'emp-007',
            designation: SC.DESIGNATION_MANAGER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('manger3@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'manager3@test.com',
            firstName: "Manager-3",
            lastName: "Three",
            roles: [managerRole],
            password: "manager",
            employeeCode: 'emp-008',
            designation: SC.DESIGNATION_MANAGER,
            dateJoined: '01-01-2018'
        })
    }

    let leaderRole = await MDL.RoleModel.findOne({name: SC.ROLE_LEADER}).lean()
    // create manager user
    if (!await MDL.UserModel.exists('leader1@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'leader1@test.com',
            firstName: "Leader-1",
            lastName: "One",
            roles: [leaderRole],
            password: "leader",
            employeeCode: 'emp-009',
            designation: SC.DESIGNATION_SENIOR_SW_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('leader2@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'leader2@test.com',
            firstName: "Leader-2",
            lastName: "Two",
            roles: [leaderRole],
            password: "leader",
            employeeCode: 'emp-010',
            designation: SC.DESIGNATION_SENIOR_SW_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('leader3@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'leader3@test.com',
            firstName: "Leader-3",
            lastName: "Three",
            roles: [leaderRole],
            password: "leader",
            employeeCode: 'emp-011',
            designation: SC.DESIGNATION_SENIOR_SW_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    let developerRole = await MDL.RoleModel.findOne({name: SC.ROLE_DEVELOPER}).lean()
    // create manager user
    if (!await MDL.UserModel.exists('developer1@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'developer1@test.com',
            firstName: "Developer-1",
            lastName: "One",
            roles: [developerRole],
            password: "developer",
            employeeCode: 'emp-012',
            designation: SC.DESIGNATION_SOFTWARE_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('developer2@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'developer2@test.com',
            firstName: "Developer-2",
            lastName: "Two",
            roles: [developerRole],
            password: "developer",
            employeeCode: 'emp-013',
            designation: SC.DESIGNATION_SOFTWARE_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('developer3@test.com')) {
        await MDL.UserModel.saveUser({
            email: 'developer3@test.com',
            firstName: "Developer-3",
            lastName: "Three",
            roles: [developerRole],
            password: "developer",
            employeeCode: 'emp-014',
            designation: SC.DESIGNATION_SOFTWARE_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }
}

const addClients = async () => {
    logger.info("SETTING UP CLIENTS ...")
    if (!await MDL.ClientModel.exists('Zaib')) {
        await MDL.ClientModel.saveClient({
            name: 'Zaib'
        })
    }

    if (!await MDL.ClientModel.exists('Mike')) {
        await MDL.ClientModel.saveClient({
            name: 'Mike'
        })
    }

    if (!await MDL.ClientModel.exists('Dean')) {
        await MDL.ClientModel.saveClient({
            name: 'Dean'
        })
    }
}

const addProjects = async () => {
    logger.info("SETTING UP PROJECTS ...")
    let zaib = await MDL.ClientModel.findOne({name: 'Zaib'})

    if (zaib) {
        if (!await MDL.ProjectModel.exists('WFSM', zaib._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'WFSM',
                client: zaib
            })
        }

        if (!await MDL.ProjectModel.exists('Catalog', zaib._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'Catalog',
                client: zaib
            })
        }

        if (!await MDL.ProjectModel.exists('WiFi Survey', zaib._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'WiFi Survey',
                client: zaib
            })
        }
    }

    let mike = await MDL.ClientModel.findOne({name: 'Mike'})

    if (mike) {
        if (!await MDL.ProjectModel.exists('LumaBooth', mike._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'LumaBooth',
                client: mike
            })
        }

        if (!await MDL.ProjectModel.exists('FotoShare', mike._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'FotoShare',
                client: mike
            })
        }
    }

    let dean = await MDL.ClientModel.findOne({name: 'Dean'})

    if (dean) {
        if (!await MDL.ProjectModel.exists('Casebrief', dean._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'Casebrief',
                client: dean
            })
        }
    }

}

const addLeaveTypes = async () => {
    logger.info("SETTING UP LEAVE DATA...")
    let cl = await MDL.LeaveTypeModel.findOne({name: 'Casual leave (CL)'})
    if (!cl) {
        await MDL.LeaveTypeModel.saveLeaveType({
            name: 'Casual leave (CL)',
            description: 'Special Casual Leave not exceeding 30 days may be sanctioned for participation in sport events, cultural activities, and mountaineering expedition in any calendar year.\n' +
            'The period of absence in excess of 30 days should be treated as regular leave of any kind. Govt. employee may be permitted as a special case to combine special casual leave with regular leave.'
        })
    }
    let les = await MDL.LeaveTypeModel.findOne({name: 'Leave for Emergency Services (LES)'})
    if (!les) {
        await MDL.LeaveTypeModel.saveLeaveType({
            name: 'Leave for Emergency Services (LES)',
            description: 'Employees who are certified by the Civil Air Patrol as emergency service specialists or certified to fly counter-narcotics missions may be granted leave of absence from their respective duties.  Leave for such service shall not be for more than 15 working days in any state fiscal year.'
        })
    }
    let sl = await MDL.LeaveTypeModel.findOne({name: 'Sick leave (SL)'})
    if (!sl) {
        await MDL.LeaveTypeModel.saveLeaveType({
            name: 'Sick leave (SL)',
            description: 'Employees who are employed on a full-time basis in positions of a continuing or permanent nature earn sick leave.  Full-time employees receive five hours of sick leave each pay period for each semi-month of service in which they are in pay status for 80 or more hours.'
        })
    }
    let al = await MDL.LeaveTypeModel.findOne({name: 'Annual Leave (AL)'})
    if (!al) {
        await MDL.LeaveTypeModel.saveLeaveType({
            name: 'Annual Leave (AL)',
            description: 'Employees in full-time positions of a continuing or permanent nature shall be entitled to accumulate annual leave as follows:\n' +
            '\n' +
            'Employees with less than ten years of total state service earn 5 hours of annual leave each pay period with a maximum annual leave balance of 240 hours.'
        })
    }
}

const addTechnologies = async () => {
    logger.info("SETTING UP TECHNOLOGIES ...")
    if (!await MDL.TechnologyModel.exists('React')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'React'
        })
    }
    if (!await MDL.TechnologyModel.exists('Koa')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Koa'
        })
    }
    if (!await MDL.TechnologyModel.exists('Node')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Node'
        })
    }
    if (!await MDL.TechnologyModel.exists('iOS')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'iOS'
        })
    }
    if (!await MDL.TechnologyModel.exists('Android')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Android'
        })
    }
    if (!await MDL.TechnologyModel.exists('Mac')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Mac'
        })
    }
    if (!await MDL.TechnologyModel.exists('React Native')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'React Native'
        })
    }
}

// This method would add tasks and features in repository
const addRepositoryTasksAndFeatures = async () => {
    logger.info("SETTING UP REPOSITORY TASKS/FEATURES ...")
    let taskIdsForFeature = []
    if (!await MDL.RepositoryModel.isTaskExists('Simple Login (AJAX) using Passport.js API (Node/Koa)')) {
        await MDL.RepositoryModel.addTask({
            name: 'Simple Login (AJAX) using Passport.js API (Node/Koa)',
            description: `Create an API that uses passport.js to authenticate against local database (mongodb)
            - On success API should return user details 
            - On failure API should failure code
            - Use bcrypt to encrypt/decrypt passwords
            - Use koa-passport as a middleware
            `,
            status: SC.STATUS_APPROVED,
            type: SC.TYPE_DEVELOPMENT,
            isFeature: false,
            isPartOfEstimation: false,
            hasHistory: false,
            technologies: ['Koa', 'Passport', 'Node'],
            tags: ['Authentication', 'Local Login']
        })
    }

    if (!await MDL.RepositoryModel.isTaskExists('Registration API (Node/Koa) basic details')) {
        await MDL.RepositoryModel.addTask({
            name: 'Registration API (Node/Koa) basic details',
            description: `Create an API that takes basic details of user (name/email etc) and store details 
            - Create an user model that would contain basic details of user
            - Create a public API to receive details from front end
            - encrypt passwords using bcrypt before storing them
            `,
            status: SC.STATUS_APPROVED,
            type: SC.TYPE_DEVELOPMENT,
            isFeature: false,
            isPartOfEstimation: false,
            hasHistory: false,
            technologies: ['Koa', 'Node', 'Mongodb'],
            tags: ['Registration', 'basic fields']
        })
    }

    if (!await MDL.RepositoryModel.isTaskExists('Login page (username/password) - React')) {
        let userLoginTask = await MDL.RepositoryModel.addTask({
            name: 'Login page (username/password) - React',
            description: `Create a login page using React 
            - Create a login component with a redux form having two fields username/password
            - Create redux reducer for keeping logged in user details
            - Create thunk action to call login API to validate logged in user
            - Call thunk action from login component and handle success/failure scenario
            - On success user details should be added into redux state
            - On failure user should appropriately be told about authentication failure
            `,
            status: SC.STATUS_APPROVED,
            type: SC.TYPE_DEVELOPMENT,
            isFeature: false,
            isPartOfEstimation: false,
            hasHistory: false,
            technologies: ['React', 'Redux'],
            tags: ['Simple Login']
        })
        if (userLoginTask)
            taskIdsForFeature.push({'_id': userLoginTask._id})
    }

    if (!await MDL.RepositoryModel.isTaskExists('Registration page (basic details) - React')) {
        let userRegistrationTask = await MDL.RepositoryModel.addTask({
            name: 'Registration page (basic details) - React',
            description: `Create a registration page with basic details of user
            Fields:
            Name, email, password, confirm password
            - Create a registration component with a redux form have mentioned fields
            - Add appropriate validation (like valid email, email not already exists)
            - Create thunk action to call registration API
            - Call thunk action from registration component and handle success/failure scenario
            - On success user should be automatically logged in with his detail added into logged in user redux state
            - On failure user should appropriately be told about registration problems (like email already registered, system failure etc.
            `,
            status: SC.STATUS_APPROVED,
            type: SC.TYPE_DEVELOPMENT,
            isFeature: false,
            isPartOfEstimation: false,
            hasHistory: false,
            technologies: ['Koa', 'Node', 'Mongodb'],
            tags: ['Registration', 'basic fields']
        })
        if (userRegistrationTask)
            taskIdsForFeature.push({'_id': userRegistrationTask._id})
    }
    if (!await MDL.RepositoryModel.isFeatureExists('User Login and registration (basic details) - React')) {
        await MDL.RepositoryModel.create({
            name: 'User Login and registration (basic details) - React',
            description: `Create a login and registration page with basic details of user
            Fields:
            Name, email, password, confirm password
            - Create a registration component with a redux form have mentioned fields
            - Add appropriate validation (like valid email, email not already exists)
            - Create thunk action to call registration API
            - Call thunk action from registration component and handle success/failure scenario
            - On success user should be automatically logged in with his detail added into logged in user redux state
            - On failure user should appropriately be told about registration problems (like email already registered, system failure etc.
            `,
            status: SC.STATUS_APPROVED,
            type: SC.TYPE_DEVELOPMENT,
            isFeature: true,
            isPartOfEstimation: false,
            hasHistory: false,
            technologies: ['Koa', 'Node', 'Mongodb'],
            tags: ['Login', 'Registration', 'basic fields'],
            tasks: taskIdsForFeature
        })
    }
}
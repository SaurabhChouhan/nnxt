import * as MDL from "../models"
import * as CC from '../../client/clientconstants'
import * as SC from '../serverconstants'
import momentTZ from 'moment-timezone'
import logger from '../logger'

export const addInitialData = async () => {
    try {

        if (!await MDL.PermissionModel.exists(CC.MANAGE_PERMISSIONS)) {
            await MDL.PermissionModel.createPermission({
                name: CC.MANAGE_PERMISSIONS
            })
        }

        if (!await MDL.PermissionModel.exists(CC.MANAGE_ROLES)) {
            await MDL.PermissionModel.createPermission({
                name: CC.MANAGE_ROLES
            })
        }

        if (!await MDL.PermissionModel.exists(CC.LIST_USERS)) {
            await MDL.PermissionModel.createPermission({
                name: CC.LIST_USERS
            })
        }

        if (!await MDL.PermissionModel.exists(CC.EDIT_PROFILE)) {
            await MDL.PermissionModel.createPermission({
                name: CC.EDIT_PROFILE
            })
        }

        if (!await MDL.PermissionModel.exists(CC.EDIT_ROLE_PERMISSIONS)) {
            await MDL.PermissionModel.createPermission({
                name: CC.EDIT_ROLE_PERMISSIONS
            })
        }

        if (!await MDL.PermissionModel.exists(CC.CREATE_USER)) {
            await MDL.PermissionModel.createPermission({
                name: CC.CREATE_USER
            })
        }

        if (!await MDL.PermissionModel.exists(CC.EDIT_USER)) {
            await MDL.PermissionModel.createPermission({
                name: CC.EDIT_USER
            })
        }

        if (!await MDL.PermissionModel.exists(CC.DELETE_USER)) {
            await MDL.PermissionModel.createPermission({
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
            await MDL.RoleModel.createRole({
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


            await MDL.RoleModel.createRole({
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
            await MDL.RoleModel.createRole({
                name: ROLE_APP_USER,
                permissions: permissions
            })
        }
        */
        /*
                if (!await MDL.UserModel.exists(SC.ADMIN_EMAIL)) {
                    let adminRole = await MDL.RoleModel.findOne({name: SC.ROLE_ADMIN}).lean()

                    // create user
                    await MDL.UserModel.createUser({
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
                    await MDL.UserModel.createUser({
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
                */

        /*
        if (!await MDL.UserModel.exists(APP_USER_EMAIL)) {
            let appUserRole = await MDL.RoleModel.findOne({name: ROLE_APP_USER}).lean()
            // create user
            await MDL.UserModel.createUser({
                email: APP_USER_EMAIL,
                firstName: "App",
                lastName: "User",
                roles: [appUserRole],
                password: "appuser"
            })
        }
        */


    } catch (error) {
        console.log(error)
    }
}

export const addNNXTData = async () => {
    await addRolesPermissions()
    await addNNXTUsers()
    await addDevelopmentTypes()
    await addClients()
    //await addProjects()
    await addLeaveTypes()
    await addTechnologies()
    //await addRepositoryTasksAndFeatures()
    await addEmployeeSettings()
    await addLeaveSettings()
    await addEvents()

}

const addRolesPermissions = async () => {
    console.log("SETTING UP ROLES/PERMISSIONS ...")

    let editProfile = await MDL.PermissionModel.findOne({name: CC.EDIT_PROFILE}).lean()
    let permissions = []
    if (editProfile) {
        editProfile.configurable = true
        editProfile.enabled = true
        permissions.push(editProfile)
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_ESTIMATOR)) {
        await MDL.RoleModel.createRole({
            name: SC.ROLE_ESTIMATOR,
            permissions: permissions
        })
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_NEGOTIATOR)) {
        await MDL.RoleModel.createRole({
            name: SC.ROLE_NEGOTIATOR,
            permissions: permissions
        })
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_MANAGER)) {
        await MDL.RoleModel.createRole({
            name: SC.ROLE_MANAGER,
            permissions: permissions
        })
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_LEADER)) {
        await MDL.RoleModel.createRole({
            name: SC.ROLE_LEADER,
            permissions: permissions
        })
    }

    if (!await MDL.RoleModel.exists(SC.ROLE_DEVELOPER)) {
        await MDL.RoleModel.createRole({
            name: SC.ROLE_DEVELOPER,
            permissions: permissions
        })
    }
    if (!await MDL.RoleModel.exists(SC.ROLE_TOP_MANAGEMENT)) {
        await MDL.RoleModel.createRole({
            name: SC.ROLE_TOP_MANAGEMENT,
            permissions: permissions
        })
    }
}

const addNNXTUsers = async () => {
    console.log("SETTING UP USERS ...")
    let estimatorRole = await MDL.RoleModel.findOne({name: SC.ROLE_ESTIMATOR}).lean()
    let negotiatorRole = await MDL.RoleModel.findOne({name: SC.ROLE_NEGOTIATOR}).lean()
    let managerRole = await MDL.RoleModel.findOne({name: SC.ROLE_MANAGER}).lean()
    let leaderRole = await MDL.RoleModel.findOne({name: SC.ROLE_LEADER}).lean()
    let developerRole = await MDL.RoleModel.findOne({name: SC.ROLE_DEVELOPER}).lean()
    let topManagementRoles = await MDL.RoleModel.findOne({name: SC.ROLE_TOP_MANAGEMENT}).lean()
    let adminRole = await MDL.RoleModel.findOne({name: SC.ROLE_ADMIN}).lean()
    let superAdminRole = await MDL.RoleModel.findOne({name: SC.ROLE_SUPER_ADMIN}).lean()


    // create user
    if (!await MDL.UserModel.exists('superadmin@aripratech.com')) {
        await MDL.UserModel.createUser({
            email: 'superadmin@aripratech.com',
            firstName: "Super",
            lastName: "Admin",
            roles: [superAdminRole],
            password: "password",
            employeeCode: 'emp-001',
            designation: SC.DESIGNATION_OWNER,
            dateJoined: '01-01-2018'
        })
    }
    if (!await MDL.UserModel.exists('admin@aripratech.com')) {
        await MDL.UserModel.createUser({
            email: 'admin@aripratech.com',
            firstName: "admin",
            lastName: "one",
            roles: [adminRole],
            password: "password",
            employeeCode: 'emp-002',
            designation: SC.DESIGNATION_OWNER,
            dateJoined: '01-01-2018'
        })
    }
    if (!await MDL.UserModel.exists('schouhan@aripratech.com')) {
        await MDL.UserModel.createUser({
            email: 'schouhan@aripratech.com',
            firstName: "Saurabh",
            lastName: "Chouhan",
            roles: [negotiatorRole, managerRole, developerRole, topManagementRoles],
            password: "password",
            employeeCode: 'emp-003',
            designation: SC.DESIGNATION_OWNER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('mpogra@aripratech.com')) {
        await MDL.UserModel.createUser({
            email: 'mpogra@aripratech.com',
            firstName: "Mahesh",
            lastName: "Pogra",
            roles: [negotiatorRole, managerRole, developerRole, topManagementRoles],
            password: "password",
            employeeCode: 'emp-004',
            designation: SC.DESIGNATION_OWNER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('ppogra@aripratech.com')) {
        await MDL.UserModel.createUser({
            email: 'ppogra@aripratech.com',
            firstName: "Prakash",
            lastName: "Pogra",
            roles: [estimatorRole, leaderRole, developerRole,],
            password: "password",
            employeeCode: 'emp-005',
            designation: SC.DESIGNATION_TEAM_LEAD,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('asharma@aripratech.com')) {
        await MDL.UserModel.createUser({
            email: 'asharma@aripratech.com',
            firstName: "Anup",
            lastName: "Sharma",
            roles: [estimatorRole, leaderRole, developerRole],
            password: "password",
            employeeCode: 'emp-006',
            designation: SC.DESIGNATION_TEAM_LEAD,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('rjain@aripratech.com')) {
        await MDL.UserModel.createUser({
            email: 'rjain@aripratech.com',
            firstName: "Ratnesh",
            lastName: "Jain",
            roles: [estimatorRole, leaderRole, developerRole],
            password: "password",
            employeeCode: 'emp-007',
            designation: SC.DESIGNATION_MODULE_LEAD,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('kamleshgour28@gmail.com')) {
        await MDL.UserModel.createUser({
            email: 'kamleshgour28@gmail.com',
            firstName: "Kamlesh",
            lastName: "Gour",
            roles: [estimatorRole, leaderRole, developerRole],
            password: "password",
            employeeCode: 'emp-008',
            designation: SC.DESIGNATION_MODULE_LEAD,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('bparashar@aripratech.com')) {
        await MDL.UserModel.createUser({
            email: 'bparashar@aripratech.com',
            firstName: "Bhuvan",
            lastName: "Parashar",
            roles: [estimatorRole, leaderRole, developerRole],
            password: "password",
            employeeCode: 'emp-009',
            designation: SC.DESIGNATION_MODULE_LEAD,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('praveenm.aripra@gmail.com')) {
        await MDL.UserModel.createUser({
            email: 'praveenm.aripra@gmail.com',
            firstName: "Praveen",
            lastName: "Malakar",
            roles: [developerRole],
            password: "password",
            employeeCode: 'emp-010',
            designation: SC.DESIGNATION_SENIOR_SW_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('khushboo.aripra@gmail.com')) {
        await MDL.UserModel.createUser({
            email: 'khushboo.aripra@gmail.com',
            firstName: "Khushboo",
            lastName: "Mishra",
            roles: [developerRole],
            password: "password",
            employeeCode: 'emp-011',
            designation: SC.DESIGNATION_SOFTWARE_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('vikash.aripra@gmail.com')) {
        await MDL.UserModel.createUser({
            email: 'vikash.aripra@gmail.com',
            firstName: "Vikas",
            lastName: "Sahu",
            roles: [developerRole],
            password: "password",
            employeeCode: 'emp-012',
            designation: SC.DESIGNATION_SOFTWARE_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('gaurav.aripra@gmail.com')) {
        await MDL.UserModel.createUser({
            email: 'gaurav.aripra@gmail.com',
            firstName: "Gaurav",
            lastName: "Agrawal",
            roles: [developerRole],
            password: "password",
            employeeCode: 'emp-013',
            designation: SC.DESIGNATION_SOFTWARE_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('murtaza.aripra@gmail.com')) {
        await MDL.UserModel.createUser({
            email: 'murtaza.aripra@gmail.com',
            firstName: "Murtaza",
            lastName: "Merchant",
            roles: [developerRole],
            password: "password",
            employeeCode: 'emp-014',
            designation: SC.DESIGNATION_SOFTWARE_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    if (!await MDL.UserModel.exists('huzefa786r@gmail.com')) {
        await MDL.UserModel.createUser({
            email: 'huzefa786r@gmail.com',
            firstName: "Huzefa",
            lastName: "Rampurawala",
            roles: [developerRole],
            password: "password",
            employeeCode: 'emp-015',
            designation: SC.DESIGNATION_SENIOR_SW_ENGINEER,
            dateJoined: '01-01-2018'
        })
    }

    /*
    if (!await MDL.UserModel.exists('contactus@aripratech.com')) {
        await MDL.UserModel.createUser({
            email: 'contactus@aripratech.com',
            firstName: "Saurabh",
            lastName: "Chouhan",
            roles: [topManagementRoles],
            password: "password",
            employeeCode: 'emp-002',
            designation: SC.DESIGNATION_OWNER,
            dateJoined: '01-01-2012'
        })
    }
    */

    if (!await MDL.UserModel.exists('apogra@gmail.com')) {
        await MDL.UserModel.createUser({
            email: 'apogra@gmail.com',
            firstName: "Mahesh P",
            lastName: "",
            roles: [estimatorRole, leaderRole],
            password: "password",
            employeeCode: 'emp-002',
            designation: SC.DESIGNATION_OWNER,
            dateJoined: '01-01-2012'
        })
    }

    if (!await MDL.UserModel.exists('chouhan.saurabh@gmail.com')) {
        await MDL.UserModel.createUser({
            email: 'chouhan.saurabh@gmail.com',
            firstName: "Saurabh C",
            lastName: "",
            roles: [estimatorRole, leaderRole],
            password: "password",
            employeeCode: 'emp-002',
            designation: SC.DESIGNATION_OWNER,
            dateJoined: '01-01-2012'
        })
    }
}

const addClients = async () => {
    console.log("SETTING UP CLIENTS ...")

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

    if (!await MDL.ClientModel.exists('Brian')) {
        await MDL.ClientModel.saveClient({
            name: 'Brian'
        })
    }

    if (!await MDL.ClientModel.exists('Aripra')) {
        await MDL.ClientModel.saveClient({
            name: 'Aripra'
        })
    }

    /*
    if (!await MDL.ClientModel.exists('Javed')) {
        await MDL.ClientModel.saveClient({
            name: 'Javed'
        })
    }

    if (!await MDL.ClientModel.exists('Zakhir')) {
        await MDL.ClientModel.saveClient({
            name: 'Zakhir'
        })
    }
    */

}

const addProjects = async () => {
    console.log("SETTING UP PROJECTS ...")
    let zaib = await MDL.ClientModel.findOne({name: 'Zaib'})

    if (zaib) {

        if (!await MDL.ProjectModel.exists('WFSM', zaib._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'WFSM',
                client: zaib
            })
        }

        if (!await MDL.ProjectModel.exists('WiFi Survey', zaib._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'WiFi Survey',
                client: zaib
            })
        }

        if (!await MDL.ProjectModel.exists('Bridgechecker', zaib._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'Bridgechecker',
                client: zaib
            })
        }

        if (!await MDL.ProjectModel.exists('WifiScanner', zaib._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'WifiScanner',
                client: zaib
            })
        }

        if (!await MDL.ProjectModel.exists('WifiPerf', zaib._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'WifiPerf',
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

    let brian = await MDL.ClientModel.findOne({name: 'Brian'})

    if (brian) {
        if (!await MDL.ProjectModel.exists('Iconoland', brian._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'Iconoland',
                client: brian
            })
        }
    }

    let javed = await MDL.ClientModel.findOne({name: 'Javed'})

    if (javed) {
        if (!await MDL.ProjectModel.exists('JCI', brian._id)) {
            await MDL.ProjectModel.saveProject({
                name: 'JCI',
                client: javed
            })
        }
    }

}

const addLeaveTypes = async () => {
    console.log("SETTING UP LEAVE DATA...")
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
    console.log("SETTING UP TECHNOLOGIES ...")

    if (!await MDL.TechnologyModel.exists('Node')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Node'
        })
    }

    if (!await MDL.TechnologyModel.exists('Objective-C')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Objective-C'
        })
    }

    if (!await MDL.TechnologyModel.exists('Swift')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Swift'
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

    if (!await MDL.TechnologyModel.exists('Java')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Java'
        })
    }

    if (!await MDL.TechnologyModel.exists('Spring')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Spring'
        })
    }

    if (!await MDL.TechnologyModel.exists('React')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'React'
        })
    }

    if (!await MDL.TechnologyModel.exists('Angular')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Angular'
        })
    }

    if (!await MDL.TechnologyModel.exists('Koa')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'Koa'
        })
    }

    if (!await MDL.TechnologyModel.exists('React Native')) {
        await MDL.TechnologyModel.saveTechnology({
            name: 'React Native'
        })
    }

}

const addDevelopmentTypes = async () => {
    console.log("SETTING UP DEVELOPMENT TYPES ...")

    if (!await MDL.DevelopmentModel.exists('Node Web Development')) {
        await MDL.DevelopmentModel.saveDevelopmentType({
            name: 'Node Web Development'
        })
    }

    if (!await MDL.DevelopmentModel.exists('iOS Development')) {
        await MDL.DevelopmentModel.saveDevelopmentType({
            name: 'iOS Development'
        })
    }

    if (!await MDL.DevelopmentModel.exists('Mac Development')) {
        await MDL.DevelopmentModel.saveDevelopmentType({
            name: 'Mac Development'
        })
    }

    if (!await MDL.DevelopmentModel.exists('Spring Web Development')) {
        await MDL.DevelopmentModel.saveDevelopmentType({
            name: 'Spring Web Development'
        })
    }

    if (!await MDL.DevelopmentModel.exists('Android Development')) {
        await MDL.DevelopmentModel.saveDevelopmentType({
            name: 'Android Development'
        })
    }

    if (!await MDL.DevelopmentModel.exists('React Native Development')) {
        await MDL.DevelopmentModel.saveDevelopmentType({
            name: 'React Native Development'
        })
    }
}

// This method would add tasks and features in repository
const addRepositoryTasksAndFeatures = async () => {
    console.log("SETTING UP REPOSITORY TASKS/FEATURES ...")
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

const addEmployeeSettings = async () => {
    console.log("SETTING UP EMPLOYEE SETTINGS ...")
    let employeeSettings = await MDL.EmployeeSettingModel.find({})
    if (!employeeSettings || !employeeSettings.length) {
        await MDL.EmployeeSettingModel.createEmployeeSettings({
            minPlannedHours: 4,
            maxPlannedHours: 8,
            free: 1,
            relativelyFree: 3,
            someWhatBusy: 5,
            busy: 7,
            superBusy: 10
        })
    }

}

const addLeaveSettings = async () => {
    console.log("SETTING UP LEAVE SETTINGS ...")
    let leaveSettings = await MDL.LeaveSettingModel.find({})
    if (!leaveSettings || !leaveSettings.length) {
        await MDL.LeaveSettingModel.createLeaveSettings({
            casualLeaves: 10,
            paidLeaves: 5,
            maternityLeaves: 20,
            paternityLeaves: 10,
            specialLeaves: 7
        })
    }

}

const addEvents = async () => {
    console.log("SETTING UP EVENTS ...")
    await addUnreportedWarningEvent()
}


const addUnreportedWarningEvent = async () => {
    // Setting up to run every night 1:00 am in india from today
    let m = momentTZ.tz(SC.INDIAN_TIMEZONE)
    m.startOf('day')
    m.hour(1)

    // Unreported warning would be checked at 5:00 PM  and 1:00 AM every day

    await MDL.EventModel.addRecurEvent({
        method: 'generateUnreportedWarnings',
        executionMoment: m,
        minMoment: undefined,
        maxMoment: undefined,
        timeZone: SC.INDIAN_TIMEZONE,
        format: SC.DATE_TIME_24HOUR_FORMAT,
        increment: 1,
        incrementUnit: SC.MOMENT_DAYS
    })

    let m1 = momentTZ.tz(SC.INDIAN_TIMEZONE)
    m1.startOf('day')
    m1.hour(17)

    await MDL.EventModel.addRecurEvent({
        method: 'generateUnreportedWarnings',
        executionMoment: m1,
        minMoment: undefined,
        maxMoment: undefined,
        timeZone: SC.INDIAN_TIMEZONE,
        format: SC.DATE_TIME_24HOUR_FORMAT,
        increment: 1,
        incrementUnit: SC.MOMENT_DAYS
    })
}
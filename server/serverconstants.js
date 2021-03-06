// Env
export const PROD_ENV = 'production'
export const DEV_ENV = 'development'
//Common Names

export const ALL = 'all'
export const NONE = 'none'

export const PROJECT_ARIPRA_TRAINING = 'Aripra Training'
export const PROJECT_ARIPRA_BIDDING = 'Aripra Bidding'


// User Role
export const ROLE_ADMIN = 'Admin'
export const ROLE_SUPER_ADMIN = 'Super Admin'
export const ROLE_APP_USER = 'App User'
export const ROLE_ESTIMATOR = 'Estimator'
export const ROLE_NEGOTIATOR = 'Negotiator'
export const ROLE_MANAGER = 'Manager'
export const ROLE_LEADER = 'Leader'
export const ROLE_DEVELOPER = 'Developer'
export const ROLE_NON_PROJECT_DEVELOPER = 'Non Project Developer'
export const ROLE_TOP_MANAGEMENT = 'Top Management'
export const ALL_ROLE_ARRAY = [
    ROLE_ADMIN,
    ROLE_SUPER_ADMIN,
    ROLE_APP_USER,
    ROLE_ESTIMATOR,
    ROLE_NEGOTIATOR,
    ROLE_MANAGER,
    ROLE_LEADER,
    ROLE_DEVELOPER,
    ROLE_TOP_MANAGEMENT
]


// test emails
export const SUPER_ADMIN_EMAIL = 'superadmin@test.com'
export const ADMIN_EMAIL = 'admin@test.com'
export const APP_USER_EMAIL = 'appuser@test.com'

// owner
export const OWNER_ESTIMATOR = 'estimator'
export const OWNER_NEGOTIATOR = 'negotiator'
export const OWNER_MANAGER = 'manager'
export const OWNER_LEADER = 'leader'

// Estimation status
export const STATUS_PENDING = 'pending'
export const STATUS_APPROVED = 'approved'
export const STATUS_INITIATED = 'initiated'
export const STATUS_ESTIMATION_REQUESTED = 'estimation-requested'
export const STATUS_REVIEW_REQUESTED = 'review-requested'
export const STATUS_CHANGE_REQUESTED = 'change-requested'
export const STATUS_REOPENED = 'reopened'
export const STATUS_PROJECT_AWARDED = 'project-awarded'
export const STATUS_REJECTED = 'rejected'
export const STATUS_CANCELLED = 'cancelled'
export const STATUS_PLANNED = 'planned'

//Leave Status


export const LEAVE_TYPE_FULL_DAY = 'Full'
export const LEAVE_TYPE_HALF_DAY = 'Half'
export const LEAVE_TYPE_DAY_WITH_NAME_ARRAY = [{name: LEAVE_TYPE_HALF_DAY}, {name: LEAVE_TYPE_FULL_DAY}]
export const LEAVE_TYPE_DAY_ARRAY = [LEAVE_TYPE_HALF_DAY, LEAVE_TYPE_FULL_DAY]


export const LEAVE_STATUS_RAISED = 'raised'
export const LEAVE_STATUS_APPROVED = 'approved'
export const LEAVE_STATUS_CANCELLED = 'cancelled'
export const ALL_LEAVE_STATUS_ARRAY = [LEAVE_STATUS_RAISED, LEAVE_STATUS_APPROVED, LEAVE_STATUS_CANCELLED]

//Release Statuses

export const STATUS_AWARDED = 'awarded'  // Project awarded
export const STATUS_DEV_IN_PROGRESS = 'dev-in-progress' // Development in progress
export const STATUS_DEV_COMPLETED = 'dev-completed' // Development completed
export const STATUS_TEST_COMPLETED = 'test-completed' // Testing completed
export const STATUS_DEPLOYED = 'deployed' // Release id deployed on production
export const STATUS_ISSUE_FIXING = 'issue-fixing' // Issue-fixing phase after deployment
export const STATUS_STABLE = 'stable' // Release become stable

export const STATUS_PLAN_REQUESTED = 'plan-requested'
export const STATUS_COMPLETED = 'completed'
export const STATUS_UNREPORTED = 'un-reported'
export const STATUS_UNPLANNED = 'unplanned'

export const TYPE_DEVELOPMENT = 'development'
export const TYPE_TESTING = 'testing'
export const TYPE_REVIEW = 'review'
export const TYPE_MANAGEMENT = 'management'
export const TYPE_COMPANY = 'company'

// operations
export const OPERATION_ADDITION = 'addition'
export const OPERATION_SUBTRACTION = 'subtraction'
export const OPERATION_SUBTRACTION_AND_ADDITION = 'subtraction-and-addition'
export const OPERATION_CREATE = 'create'
export const OPERATION_UPDATE = 'update'
export const OPERATION_DELETE = 'delete'

//warning related
export const WARNING_TYPE_RELEASE = 'release'
export const WARNING_TYPE_RELEASE_PLAN = 'release_plan'
export const WARNING_TYPE_TASK_PLAN = 'task_plan'
export const WARNING_UNPLANNED = 'unplanned'
export const WARNING_TOO_MANY_HOURS = 'too_many_hours'
export const WARNING_EMPLOYEE_ON_LEAVE = 'employee_on_leave'
export const WARNING_EMPLOYEE_ASK_FOR_LEAVE = 'employee_ask_for_leave'
export const WARNING_RELEASE_DATE_MISSED_1 = 'release_date_missed_1'
export const WARNING_RELEASE_DATE_MISSED_2 = 'release_date_missed_2'
export const WARNING_RELEASE_DATE_MISSED_3 = 'release_date_missed_3'
export const WARNING_RELEASE_DATE_MISSED_4 = 'release_date_missed_4'
export const WARNING_PLANNED_BEYOND_RELEASE_DATE = 'planned_beyond_release_date'
export const WARNING_LESS_PLANNED_HOURS = 'less_planned_hours'
export const WARNING_MORE_PLANNED_HOURS = 'more_planned_hours'
export const WARNING_MORE_REPORTED_HOURS_1 = 'more_reported_hours_1'
export const WARNING_MORE_REPORTED_HOURS_2 = 'more_reported_hours_2'
export const WARNING_MORE_REPORTED_HOURS_3 = 'more_reported_hours_3'
export const WARNING_MORE_REPORTED_HOURS_4 = 'more_reported_hours_4'
export const WARNING_HAS_UNREPORTED_DAYS = 'has_unreported_days'
export const WARNING_UNREPORTED = 'unreported'
export const WARNING_PENDING_ON_END_DATE = 'pending_on_end_date'
export const WARNING_COMPLETED_BEFORE_END_DATE = 'completed_before_end_date'

/*
  'estimated' - There can be any number of iterations with this iteration type. Whenever any estimation
  is added in new release or added to current release a new iteration of these type would be added
  with all the tasks in estimation linked to iteration created.
*/

export const ITERATION_TYPE_ESTIMATED = 'estimated' // Iterations which are added from estimation process
/*
 'planned' - At the moment there would only be one iteration with this iteration_type which would be
 created when release is created.
 All the tasks that were added from release interface would be added against this iteration
 All such tasks would have estimated hours. These tasks would have all the functionality (warning generation,
 progress calculation etc) that tasks added against iteration of type 'estimated'.

 Only difference these tasks would have the way they can be added into system. These tasks would be added
 from release interface by manager/leader. Tasks added in 'estimated' iteration however are added from
 estimations created by negotiator/estimator.

 Another difference is that these tasks would be added directly against release without the need for
 manager/leader to consulting each other (giving ease of addition but compromising the need of getting
 approval of other party). Can be useful in some cases.
 */

export const ITERATION_TYPE_PLANNED = 'planned'

/*
 At the moment there would only be one iteration with the iteration_type 'unplanned', this
 iteration would be created when release is created.
 All the unplanned work reported through reporting interface would be linked to this iteration. All tasks
 added against this iteration would not have any part in progress calculation but they would become part
 of billing interface.

*/
export const ITERATION_TYPE_UNPLANNED = 'unplanned'
export const ITERATION_TYPE_LIST_WITH_NAME = [{name: ITERATION_TYPE_PLANNED}, {name: ITERATION_TYPE_UNPLANNED}]


export const ALL_WARNING_NAME_ARRAY = [
    WARNING_UNPLANNED,
    WARNING_TOO_MANY_HOURS,
    WARNING_EMPLOYEE_ON_LEAVE,
    WARNING_EMPLOYEE_ASK_FOR_LEAVE,
    WARNING_RELEASE_DATE_MISSED_1,
    WARNING_RELEASE_DATE_MISSED_2,
    WARNING_RELEASE_DATE_MISSED_3,
    WARNING_RELEASE_DATE_MISSED_4,
    WARNING_PLANNED_BEYOND_RELEASE_DATE,
    WARNING_LESS_PLANNED_HOURS,
    WARNING_MORE_PLANNED_HOURS,
    WARNING_MORE_REPORTED_HOURS_1, // When (reportedHours > estimatedHours)
    WARNING_MORE_REPORTED_HOURS_2, // When (reportedHours > (1.5) * estimatedHours)
    WARNING_MORE_REPORTED_HOURS_3, //When (reportedHours > 2 * estimatedHours)
    WARNING_MORE_REPORTED_HOURS_4, // When (reportedHours > 4 * estimatedHours)
    WARNING_HAS_UNREPORTED_DAYS,
    WARNING_UNREPORTED,
    WARNING_PENDING_ON_END_DATE,
    WARNING_COMPLETED_BEFORE_END_DATE,
]


//Designation
export const DESIGNATION_SOFTWARE_ENGINEER = "Software Engineer"
export const DESIGNATION_SOFTWARE_TRAINEE = "Software Trainee"
export const DESIGNATION_SENIOR_SW_ENGINEER = "Sr. Software Engineer"
export const DESIGNATION_MODULE_LEAD = "Module Lead"
export const DESIGNATION_TEAM_LEAD = "Team Lead"
export const DESIGNATION_MANAGER = "Manager"
export const DESIGNATION_OWNER = "Owner"

//reasons
export const REASON_GENERAL_DELAY = "general-delay"
export const REASON_EMPLOYEE_ON_LEAVE = "employee-on-leave"
export const REASON_INCOMPLETE_DEPENDENCY = "incomplete-dependency"
export const REASON_NO_GUIDANCE_PROVIDED = "no-guidance-provided"
export const REASON_RESEARCH_WORK = "research-work"
export const REASON_UNFAMILIAR_TECHNOLOGY = "unfamiliar-technology"


// Holiday Reason

export const HOLIDAY_REASON_EMERGENCY = "Emergency"
export const HOLIDAY_REASON_PUBLIC_HOLIDAY = "Public Holiday"
export const HOLIDAY_REASON_NATIONAL_DAY = "National Day"
export const HOLIDAY_REASON_GAZETTED_HOLIDAYS = "Gazetted Holidays"
export const HOLIDAY_TYPE_LIST_WITH_NAME = [
    {name: HOLIDAY_REASON_EMERGENCY},
    {name: HOLIDAY_REASON_PUBLIC_HOLIDAY},
    {name: HOLIDAY_REASON_NATIONAL_DAY},
    {name: HOLIDAY_REASON_GAZETTED_HOLIDAYS}]


export const HOLIDAY_TYPE_LIST = [
    HOLIDAY_REASON_EMERGENCY,
    HOLIDAY_REASON_PUBLIC_HOLIDAY,
    HOLIDAY_REASON_NATIONAL_DAY,
    HOLIDAY_REASON_GAZETTED_HOLIDAYS
]
export const REASON_MEDICAL = "medical"
export const REASON_PERSONAL = "personal"
export const REASON_OCCASION = "occasion"
export const REASON_FESTIVAL = "festival"

// reporting final status
export const REPORT_UNREPORTED = "un-reported"
export const REPORT_COMPLETED = "completed"
export const REPORT_PENDING = "pending"
export const PLANNED_FOR_PAST = "planned_for_past"
export const PLANNED_FOR_FUTURE = "planned_for_future"

// Date Formate and Time Zone
export const DEFAULT_DATE_FORMAT = 'DD-MM-YYYY'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const DATE_TIME_FORMAT = 'YYYY-MM-DD hh:mm A'
export const DATE_TIME_24HOUR_FORMAT = 'YYYY-MM-DD HH:mm'
export const DATE_AND_DAY_SHOW_FORMAT = 'dddd YYYY-MMMM-DD '
export const DATE_DAY_AND_TIME_SHOW_FORMAT = 'dddd YYYY-MMMM-DD  hh:mm '
export const DATE_TIME_SHOW_FORMAT = 'dddd YYYY-MMMM-DD  hh:mm '
export const DATE_TIME_SHOW_FORMAT_WITH_AM_PM = 'dddd YYYY-MMMM-DD  hh:mm A'
export const TIME_FORMAT = 'hh:mm A'
export const TIME_FORMAT_24_HOURS = 'HH:mm'
export const DATE_AND_TIME_FORMAT = 'LLL'
export const DATE_MONTH_FORMAT = 'MMMM Do'
export const DATE_HALF_WEAK_MONTH_FORMAT = 'ddd'
export const DATE_DISPLAY_FORMAT = 'DD/MM/YYYY'


// Time Zones
// !!! NEVER CHANGE DEFAULT TIME ZONE AS ALL THE DATABASE CALCULATIONS ARE BASED ON THIS !!!

// !!! NEVER CHANGE DEFAULT TIME ZONE AS ALL THE DATABASE CALCULATIONS ARE BASED ON THIS !!!
export const UTC_TIMEZONE = 'UTC'
export const DEFAULT_TIMEZONE = 'UTC'
export const INDIAN_TIMEZONE = 'Asia/Calcutta'
//Comment Types

export const TYPE_CLARIFICATION = 'Need Clarification'
export const TYPE_BLOCKING = 'Blocking Issue'
export const TYPE_WAITING = 'Waiting for Changes'
export const TYPE_REPORT_COMMENT = 'Report Comment'
export const TYPE_INFORMATION = 'For Information'


export const COMMENT_EMERGENCY = 'Emergency'
export const COMMENT_CRITICAL = 'Critical'
export const COMMENT_URGENT = 'Urgent'
export const COMMENT_REPORTING = 'Reporting'
export const COMMENT_FYI_ONLY = 'FYI Only'

//Dialog Names
export const DIALOG_ESTIMATION_REQUEST_REVIEW = 'dialog-request-review'
export const RELEASE_DASHBOARD_TAB = 'RELEASE_DASHBOARD_TAB'
export const RELEASE_WARNINGS_TAB = 'RELEASE_WARNINGS_TAB'
export const RELEASE_TASK_PLANS_TAB = 'RELEASE_TASK_PLANS_TAB'
export const RELEASE_REPORT_TAB = 'RELEASE_REPORT_TAB'
export const RELEASE_PLAN_TAB = 'RELEASE_PLAN_TAB'


export const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export const MONTHS_WITH_MONTH_NUMBER = [
    {
        name: "January",
        number: 0
    }, {
        name: "February",
        number: 1
    }, {
        name: "March",
        number: 2
    }, {
        name: "April",
        number: 3
    }, {
        name: "May",
        number: 4
    }, {
        name: "June",
        number: 5
    }, {
        name: "July",
        number: 6
    }, {
        name: "August",
        number: 7
    }, {
        name: "September",
        number: 8
    }, {
        name: "October",
        number: 9
    }, {
        name: "November",
        number: 10
    }, {
        name: "December",
        number: 11
    }]

// Attendance

export const MINIMUM_HALF_DAY_MINUTE = 4 * 60
export const MINIMUM_FULL_DAY_MINUTE = 7 * 60
export const HALF_DAY = 'halfDay'
export const FULL_DAY = 'fullDay'
export const ARRIVED = 'arrived'
export const ABSENT = 'absent'


// Events
export const MOMENT_MINUTES = 'm'
export const MOMENT_HOURS = 'H'
export const MOMENT_DAYS = 'd'
export const MOMENT_WEEKS = 'w'
export const MOMENT_MONTHS = 'M'
export const MOMENT_QUARTERS = 'Q'
export const MOMENT_YEARS = 'y'

export const EVENT_ONETIME = 'onetime'
export const EVENT_RECURRING = 'recurring'

export const EVENT_SCHEDULED = 'scheduled'
export const EVENT_RUNNING = 'running'
export const EVENT_COMPLETED = 'completed'
export const EVENT_FAILED = 'failed'

export const EVENT_INTERVAL = 1000 * 3600

export const MODE_DEVELOPMENT = "development"
export const MODE_PRODUCTION = "production"

//Task Plan Search Status
export const ALL_TASK_STATUS = [
    STATUS_UNREPORTED,
    STATUS_PENDING,
    STATUS_COMPLETED
]

export const ALL_REPORTED_STATUS = [
    STATUS_PENDING,
    STATUS_COMPLETED
]

export const ALL_RELEASE_STATUS = [
    STATUS_AWARDED,
    STATUS_DEV_IN_PROGRESS,
    STATUS_DEV_COMPLETED,
    STATUS_TEST_COMPLETED,
    STATUS_DEPLOYED,
    STATUS_ISSUE_FIXING,
    STATUS_STABLE
]

/* Email Notifications Configuration Settings */
/* Email Settings */
export const NNXT_SELF_USER_AND_EMAIL_INFO = {"_id": "5b87dea2749236069ce69430", "email": "nnxt@aripratech.com"}
export const SENDER_EMAIL_ADDRESS = "nnxt@aripratech.com"
export const NNXT_LOGO_URL = "http://nnxt.aripratech.com/images/logos/nnxt-logo.png"
export const SERVER_BASE_URL = "http://nnxt.aripratech.com/"
export const COPY_RIGHT_FOOTER_MESSAGE = "Copyright 2018 : All right reserved."
export const NNXT_ADMIN = "schouhan@aripratech.com"//"mpogra@aripratech.com" or "schouhan@aripratech.com"

/* Email Templates Name and Messages*/
export const EMAIl_HEADR_TEMPLATE = '<div style = "height: 42px;color: white;background: #333;padding-top: 15px;font-weight: bold;font-size: 25px;padding-left: 10px;">' +
    '<img src="{NNXT_LOGO_URL}/img/logo.png" title="NNXT" alt="NNXT"/> </div>'
export const EMAIl_TEMPLATE_FOOTER = '<div style = "height: 37px;color: white;background: #333;padding-top: 18px;font-weight: bold;font-size:14px;text-align: center;"> {COPY_RIGHT_FOOTER_MESSAGE} </div>'

/* Basic Email Templates Name */
export const WELCOME_TEMPLATE = "Welcome-Template"
export const OTP_TEMPLATE = "OTP-Template"
export const RESET_PASSWORD_TEMPLATE = "Reset-Password-Template"

/* Leaves Email Templates Name */
export const RAISE_LEAVE_TEMPLATE = "Raise-Leave-Template"
export const APPROVED_LEAVE_TEMPLATE = "Approved-Leave-Template"
export const REJECT_RAISED_LEAVE_TEMPLATE = "Reject-Raised-Leave-Template"

/* Reporting Email Templates Name */
export const REPORTING_COMPLETE_MARK_TEMPLATE = "Reporting-Complete-Mark-Template"
export const REPORTING_PENDING_MARK_TEMPLATE = "Reporting-Pending-Mark-Template"
export const REPORTING_UN_REPORTED_TEMPLATE = "Reporting-Un-Reported-Template"

/* Notification types */
export const NOTIFICATION_TYPE_LEAVE_RAISED = "LEAVE_RAISED"
export const NOTIFICATION_TYPE_LEAVE_APPROVED = "LEAVE_APPROVED"
export const NOTIFICATION_TYPE_LEAVE_REJECTED = "LEAVE_REJECTED"
export const NOTIFICATION_TYPE_LEAVE_REMOVED = "LEAVE_REMOVED"
export const NOTIFICATION_TYPE_TASK_ASSIGNED = "TASK_ASSIGNED"
export const NOTIFICATION_TYPE_TASK_UNASSIGNED = "TASK_UNASSIGNED"
export const NOTIFICATION_TYPE_TASK_MOVED = "TASK_MOVED"
export const NOTIFICATION_TYPE_TASK_REMOVED = "TASK_REMOVED"
export const NOTIFICATION_TYPE_TASK_REPORTED = "TASK_REPORTED"
export const NOTIFICATION_TYPE_TASK_UNREPORTED = "TASK_UNREPORTED"
export const NOTIFICATION_TYPE_TASK_REREPORTED = "TASK_UPDATED"
export const NOTIFICATION_TYPE_TASK_SHIFTED = "TASK_SHIFTED"

export const ALL_NOTIFICATION_TYPES = [
    NOTIFICATION_TYPE_LEAVE_RAISED,
    NOTIFICATION_TYPE_LEAVE_APPROVED,
    NOTIFICATION_TYPE_LEAVE_REJECTED,
    NOTIFICATION_TYPE_LEAVE_REMOVED,
    NOTIFICATION_TYPE_TASK_ASSIGNED,
    NOTIFICATION_TYPE_TASK_UNASSIGNED,
    NOTIFICATION_TYPE_TASK_MOVED,
    NOTIFICATION_TYPE_TASK_REMOVED,
    NOTIFICATION_TYPE_TASK_REPORTED,
    NOTIFICATION_TYPE_TASK_UNREPORTED,
    NOTIFICATION_TYPE_TASK_REREPORTED,
    NOTIFICATION_TYPE_TASK_SHIFTED
]


export const NOTIFICATION_CATEGORY_LEAVES = "Leaves"
export const NOTIFICATION_CATEGORY_ESTIMATION = "Estimation"
export const NOTIFICATION_CATEGORY_RELEASE = "Release"
export const NOTIFICATION_CATEGORY_TASK_ASSIGNMENT = "Task Assignment"
export const NOTIFICATION_CATEGORY_REPORT = "Report"
export const NOTIFICATION_CATEGORY_WARNINGS = "Warnings"

export const ALL_NOTIFICATION_CATEGORIES = [
    NOTIFICATION_CATEGORY_LEAVES,
    NOTIFICATION_CATEGORY_ESTIMATION,
    NOTIFICATION_CATEGORY_RELEASE,
    NOTIFICATION_CATEGORY_TASK_ASSIGNMENT,
    NOTIFICATION_CATEGORY_REPORT,
    NOTIFICATION_CATEGORY_WARNINGS
]

export const RELEASE_TYPE_CLIENT = 'Client'
export const RELEASE_TYPE_INTERNAL = 'Internal'
export const RELEASE_TYPE_TRAINING = 'Training'
export const RELEASE_TYPE_JOBS = 'Jobs'

export const RELEASE_TYPES = [RELEASE_TYPE_CLIENT, RELEASE_TYPE_INTERNAL, RELEASE_TYPE_JOBS, RELEASE_TYPE_TRAINING]

export const RELEASE_TYPES_WITH_LABELS = [
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


export const CLIENT_ARIPRA = 'Aripra'


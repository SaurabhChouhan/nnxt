// Env
export const PROD_ENV = 'production'
export const DEV_ENV = 'development'
//Common Names

export const ALL = 'all'

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

//Statuses

export const STATUS_AWARDED = 'awarded'
export const STATUS_DEV_IN_PROGRESS = 'dev-in-progress'
export const STATUS_DEV_COMPLETED = 'dev-completed'
export const STATUS_ISSUE_FIXING = 'issue-fixing'
export const STATUS_TEST_COMPLETED = 'test-completed'
export const STATUS_STABLE = 'stable'
export const STATUS_RELEASED = 'released'

export const STATUS_PLAN_REQUESTED = 'plan-requested'
export const STATUS_COMPLETED = 'completed'
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

// Time Zones
// !!! NEVER CHANGE DEFAULT TIME ZONE AS ALL THE DATABASE CALCULATIONS ARE BASED ON THIS !!!

// !!! NEVER CHANGE DEFAULT TIME ZONE AS ALL THE DATABASE CALCULATIONS ARE BASED ON THIS !!!
export const UTC_TIMEZONE = 'UTC'
export const DEFAULT_TIMEZONE = 'UTC'
export const INDIAN_TIMEZONE = 'Asia/Calcutta'
//Comment Types
export const COMMENT_EMERGENCY = 'Emergency'
export const COMMENT_CRITICAL = 'Critical'
export const COMMENT_URGENT = 'Urgent'
export const COMMENT_REPORTING = 'Reporting'
export const COMMENT_FYI_ONLY = 'FYI Only'

//Dialog Names
export const DIALOG_ESTIMATION_REQUEST_REVIEW = 'dialog-request-review'
export const WARNINGS_LIST = 'Warning List'
export const TASK_PLANS_LIST = 'Task Plan List'
export const TASK_REPORT_LIST = 'Task Report List'
export const RELEASE_PLAN_LIST = 'Release Plan List'


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

export const EVENT_INTERVAL = 1000 * 15

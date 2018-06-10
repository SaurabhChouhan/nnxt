// Env
export const PROD_ENV = 'production'
export const DEV_ENV = 'development'


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


//reporting status
export const STATUS_PLAN_REQUESTED = 'plan-requested'
export const STATUS_DEV_IN_PROGRESS = 'dev-in-progress'
export const STATUS_DEV_COMPLETED = 'dev-completed'
export const STATUS_RELEASED = 'released'
export const STATUS_ISSUE_FIXING = 'issue-fixing'
export const STATUS_OVER = 'over'
export const STATUS_COMPLETED = 'completed'
export const STATUS_UNPLANNED = 'unplanned'

export const TYPE_DEVELOPMENT = 'development'


// operations
export const OPERATION_ADDITION = 'addition'
export const OPERATION_SUBTRACTION = 'subtraction'
export const OPERATION_SUBTRACTION_AND_ADDITION = 'subtraction-and-addition'


//warning related

export const WARNING_TYPE_RELEASE = 'release'
export const WARNING_TYPE_RELEASE_PLAN = 'realease_plan'
export const WARNING_TYPE_TASK_PLAN = 'task_plan'
export const WARNING_UNPLANNED = 'unplanned'
export const WARNING_TOO_MANY_HOURS = 'too_many_hours'
export const WARNING_EMPLOYEE_ON_LEAVE = 'employee-on-leave'
export const WARNING_EMPLOYEE_ASK_FOR_LEAVE = 'employee-ask-for-leave'
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
export const WARNING_HAS_UNREPORTED_DAYS = 'has-unreported-days'
export const WARNING_UNREPORTED = 'unreported'
export const WARNING_PENDING_ON_END_DATE = 'pending-on-enddate'
export const WARNING_COMPLETED_BEFORE_END_DATE = 'completed-before-enddate'


export const ALL_WARNING_NAME_ARRAY = [
    WARNING_TYPE_RELEASE,
    WARNING_TYPE_RELEASE_PLAN,
    WARNING_TYPE_TASK_PLAN,
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
    WARNING_MORE_REPORTED_HOURS_1,
    WARNING_MORE_REPORTED_HOURS_2,
    WARNING_MORE_REPORTED_HOURS_3,
    WARNING_MORE_REPORTED_HOURS_4,
    WARNING_HAS_UNREPORTED_DAYS,
    WARNING_UNREPORTED,
    WARNING_PENDING_ON_END_DATE,
    WARNING_COMPLETED_BEFORE_END_DATE,
]



export const LEAVE_TYPE_FULL_DAY = 'Full'
export const LEAVE_TYPE_HALF_DAY = 'Half'


//Designation
export const DESIGNATION_SOFTWARE_ENGINEER = "Software Engineer"
export const DESIGNATION_SOFTWARE_TRAINEE = "Software Trainee"
export const DESIGNATION_SENIOR_SW_ENGINEER = "Sr. Software Engineer"
export const DESIGNATION_TEAM_LEAD = "Team Leader"
export const DESIGNATION_MANAGER = "Manager"

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
export const DATE_AND_DAY_SHOW_FORMAT = 'dddd YYYY-MMMM-DD  hh:mm '
export const DATE_TIME_SHOW_FORMAT = 'dddd YYYY-MMMM-DD  hh:mm '
export const DATE_TIME_SHOW_FORMAT_WITH_AM_PM = 'dddd YYYY-MMMM-DD  hh:mm A'
export const TIME_FORMAT = 'hh:mm A'
export const DATE_AND_TIME_FORMAT = 'LLL'
export const DATE_MONTH_FORMAT = 'MMMM Do'
export const DATE_HALF_WEAK_MONTH_FORMAT = 'ddd'

// Time Zones
// !!! NEVER CHANGE DEFAULT TIME ZONE AS ALL THE DATABASE CALCULATIONS ARE BASED ON THIS !!!
export const DEFAULT_TIMEZONE = 'UTC'
// !!! NEVER CHANGE DEFAULT TIME ZONE AS ALL THE DATABASE CALCULATIONS ARE BASED ON THIS !!!

export const INDIAN_TIMEZONE = 'Asia/Calcutta'
//Comment Types
export const COMMENT_EMERGENCY = 'Emergency'
export const COMMENT_CRITICAL = 'Critical'
export const COMMENT_URGENT = 'Urgent'
export const COMMENT_REPORTING = 'Reporting'
export const COMMENT_FYI_ONLY = 'FYI Only'

//Dialog Names
export const DIALOG_ESTIMATION_REQUEST_REVIEW = 'dialog-request-review'


export const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]


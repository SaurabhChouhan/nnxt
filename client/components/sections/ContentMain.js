import React, {Component} from 'react'
import ContentSection from './ContentSection'
import {
    AttendanceSettingFormContainer,
    CalendarTaskDetailPageContainer,
    CalendarTaskPageContainer,
    ClientListContainer,
    EstimationDetailContainer,
    EstimationListContainer,
    ProjectListContainer,
    ModuleListContainer,
    LeaveListContainer,
    ReleaseListContainer,
    ReleasePlanSectionContainer,
    ReleaseTaskPlanningPageContainer,
    ReportingTaskDetailPageContainer,
    ReportingTaskPageContainer,
    TechnologyListContainer,
    UserProfileFormContainer,
    LeaveDetailPageContainer,
    DashboardSectionContainer,
    TaskReportDetailPageContainer,
    CompanySectionContainer,
    NotificationsPageContainer,
    BillingSectionContainer
} from "../../containers"
import * as COC from '../componentConsts'
import * as A from '../../actions'
import {
    ClientFormDialog,
    EstimationFeatureDialog,
    EstimationFilterDialog,
    EstimationInitiateDialog,
    EstimationProjectAwardDialog,
    EstimationSuggestFeatureDialog,
    EstimationSuggestTaskDialog,
    EstimationTaskDialog,
    LeaveRequestFormDialog,
    MoveTaskInFeatureFormDialog,
    ProjectFormDialog,
    ModuleFormDialog,
    ReleaseMoveTaskPlanFormDialog,
    ReleaseTaskPlanningFormDialog,
    RepositoryFeatureDetailDialog,
    RepositoryTaskDetailDialog,
    TechnologyFormDialog,
    LeaveApproveDialog,
    LeaveRejectDialog,
    UpdateReleaseDatesFormDialog,
    EstimationAddToReleaseDialog,
    ReleasePlanAddToReleaseDialog,
    UpdateReleasePlanDialog,
    TaskShiftDialog,
    ReportTaskDescriptionFormDialog,
    CreateReleaseDialog,
    UpdateReleaseDialog

} from "../index"
import {Route} from 'react-router-dom'
import * as logger from '../../clientLogger'
import {TaskPlanDetailPageContainer} from "../../containers/index";

class ContentMain extends Component {
    constructor(props) {
        super(props)
        logger.debug(logger.CONTENT_MAIN_LIFECYCLE, 'constructor() called: ', props)
        // All the routes that should be configured based on permissions this user has
        let routes = []


        routes.push({
            url: "/company",
            render: (props) => {
                return <ContentSection>
                    <CompanySectionContainer name={COC.COMPANY_SECTION} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.COMPANY_SECTION))
                        }
                    }/>
                </ContentSection>
            }
        })

        routes.push({
            url: "/dashboard",
            render: (props) => {
                return <ContentSection>
                    <DashboardSectionContainer name={COC.DASHBOARD_SECTION} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.DASHBOARD_SECTION))
                        }
                    }/>
                </ContentSection>
            }
        })

        routes.push({
            url: "/billing",
            render: (props) => {
                return <ContentSection>
                    <BillingSectionContainer name={COC.BILLING_SECTION} show={true} />
                </ContentSection>
            }
        })

        routes.push({
            url: "/client",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/client: props:", props)
                return <ContentSection>
                    <ClientFormDialog name={COC.CLIENT_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.CLIENT_FORM_DIALOG))
                        }
                    }/>
                    <ClientListContainer name={COC.CLIENT_LIST}/>
                </ContentSection>
            }
        })

        routes.push({
            url: "/projects",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/projects: props:", props)
                return <ContentSection>
                    <ProjectFormDialog name={COC.PROJECT_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.PROJECT_FORM_DIALOG))
                        }
                    }/>
                    <ProjectListContainer name={COC.PROJECT_LIST}/>
                </ContentSection>


            }
        })

        routes.push({
            url: "/modules",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/modules: props:", props)
                return <ContentSection>
                    <ModuleFormDialog name={COC.MODULE_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.MODULE_FORM_DIALOG))
                        }
                    }/>
                    <ModuleListContainer name={COC.MODULE_LIST}/>
                </ContentSection>


            }
        })
        routes.push({
            url: "/technology",
            render: (props) => {

                logger.debug(logger.CONTENT_MAIN_RENDER, "/technology: props:", props)
                return <ContentSection>
                    <TechnologyFormDialog name={COC.TECHNOLOGY_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.TECHNOLOGY_FORM_DIALOG))
                        }
                    }/>
                    <TechnologyListContainer name={COC.TECHNOLOGIES_LIST}/>
                </ContentSection>


            }
        })

        routes.push({
            url: "/estimation",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/estimation: props:", props)
                return <ContentSection>
                    <EstimationInitiateDialog name={COC.ESTIMATION_INITIATE_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.ESTIMATION_INITIATE_DIALOG))
                        }
                    }/>
                    <EstimationListContainer name={COC.ESTIMATION_LIST}/>
                </ContentSection>
            }
        })

        routes.push({
            url: "/estimation-detail",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/estimation-detail: props:", props)
                return <ContentSection>
                    <EstimationInitiateDialog name={COC.ESTIMATION_INITIATE_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.ESTIMATION_INITIATE_DIALOG))
                        }
                    }/>
                    <EstimationTaskDialog name={COC.ESTIMATION_TASK_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.ESTIMATION_TASK_DIALOG))
                        }
                    }/>
                    <EstimationFeatureDialog name={COC.ESTIMATION_FEATURE_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.ESTIMATION_FEATURE_DIALOG))
                        }
                    }/>
                    <MoveTaskInFeatureFormDialog name={COC.MOVE_TASK_TO_FEATURE_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.MOVE_TASK_TO_FEATURE_FORM_DIALOG))
                        }
                    }/>
                    <EstimationSuggestTaskDialog name={COC.ESTIMATION_SUGGEST_TASK_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.ESTIMATION_SUGGEST_TASK_FORM_DIALOG))
                        }
                    }/>
                    <EstimationSuggestFeatureDialog name={COC.ESTIMATION_SUGGEST_FEATURE_FORM_DIALOG} show={true}
                                                    close={
                                                        () => {
                                                            this.props.dispatch(A.hideComponent(COC.ESTIMATION_SUGGEST_FEATURE_FORM_DIALOG))
                                                        }
                                                    }/>
                    <RepositoryTaskDetailDialog name={COC.REPOSITORY_TASK_DETAIL_DIALOG} show={true}
                                                close={
                                                    () => {
                                                        this.props.dispatch(A.hideComponent(COC.REPOSITORY_TASK_DETAIL_DIALOG))
                                                    }
                                                }/>
                    <RepositoryFeatureDetailDialog name={COC.REPOSITORY_FEATURE_DETAIL_DIALOG} show={true}
                                                   close={
                                                       () => {
                                                           this.props.dispatch(A.hideComponent(COC.REPOSITORY_FEATURE_DETAIL_DIALOG))
                                                       }
                                                   }/>
                    <EstimationDetailContainer name={COC.ESTIMATION_DETAIL_PAGE}/>

                    <EstimationProjectAwardDialog name={COC.ESTIMATION_PROJECT_AWARD_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.ESTIMATION_PROJECT_AWARD_FORM_DIALOG))
                        }
                    }/>
                    <EstimationAddToReleaseDialog name={COC.ESTIMATION_ADD_TO_RELEASE_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.ESTIMATION_ADD_TO_RELEASE_FORM_DIALOG))
                        }
                    }/>
                    <EstimationFilterDialog name={COC.ESTIMATION_FILTER_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.ESTIMATION_FILTER_DIALOG))
                        }
                    }/>
                </ContentSection>
            }
        })

        routes.push({
            url: "/leave",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/leave: props:", props)
                return <ContentSection>
                    <LeaveRequestFormDialog name={COC.LEAVE_REQUEST_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.LEAVE_REQUEST_FORM_DIALOG))
                        }
                    }/>
                    <LeaveApproveDialog name={COC.LEAVE_APPROVE_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.LEAVE_APPROVE_DIALOG))
                        }
                    }/>
                    <LeaveRejectDialog name={COC.LEAVE_REJECT_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.LEAVE_REJECT_DIALOG))
                        }
                    }/>
                    <LeaveListContainer name={COC.LEAVE_LIST}/>
                </ContentSection>
            }
        })
        routes.push({
            url: "/leave-detail",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/leave: props:", props)
                return <ContentSection>
                    <LeaveDetailPageContainer name={COC.LEAVE_DETAIL_PAGE}/>
                </ContentSection>
            }
        })

        routes.push({
            url: "/attendance",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/attendance: props:", props)
                return <ContentSection>
                    <AttendanceSettingFormContainer name={COC.ATTENDANCE_SETTING_FORM}/>
                </ContentSection>

            }
        })

        routes.push({
            url: "/release",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/release: props:", props)
                return <ContentSection>
                    <ReleaseListContainer name={COC.RELEASE_LIST}/>
                    <CreateReleaseDialog name={COC.CREATE_RELEASE_FORM_DIALOG} show={true}
                                         close={
                                             () => {
                                                 this.props.dispatch(A.hideComponent(COC.CREATE_RELEASE_FORM_DIALOG))
                                             }
                                         }/>
                </ContentSection>

            }
        })

        routes.push({
            url: "/release-plan",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/release: props:", props)
                return <ContentSection>
                    <ReleasePlanSectionContainer name={COC.RELEASE_PLAN_SECTION}/>
                    <UpdateReleaseDatesFormDialog name={COC.UPDATE_RELEASE_DATES_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.UPDATE_RELEASE_DATES_DIALOG))
                        }
                    }/>
                    <UpdateReleaseDialog name={COC.UPDATE_RELEASE_FORM_DIALOG} show={true}
                                         close={
                                             () => {
                                                 this.props.dispatch(A.hideComponent(COC.UPDATE_RELEASE_FORM_DIALOG))
                                             }
                                         }/>
                    <ReleasePlanAddToReleaseDialog name={COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG} show={true}
                                                   close={
                                                       () => {
                                                           this.props.dispatch(A.hideComponent(COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG))
                                                       }
                                                   }/>
                    <UpdateReleasePlanDialog name={COC.UPDATE_RELEASE_PLAN_FORM_DIALOG} show={true}
                                                   close={
                                                       () => {
                                                           this.props.dispatch(A.hideComponent(COC.UPDATE_RELEASE_PLAN_FORM_DIALOG))
                                                       }
                                                   }/>
                </ContentSection>

            }
        })

        routes.push({
            url: "/release-task-planning",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/release: props:", props)
                return <ContentSection>
                    <ReleaseTaskPlanningPageContainer name={COC.RELEASE_TASK_PLANNING_PAGE}/>
                    <TaskShiftDialog name={COC.TASK_SHIFT_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.TASK_SHIFT_DIALOG))
                        }
                    }/>
                    <ReleaseTaskPlanningFormDialog name={COC.RELEASE_TASK_PLANNING_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
                        }
                    }/>
                    <ReleaseMoveTaskPlanFormDialog name={COC.MOVE_TASK_PLAN_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.MOVE_TASK_PLAN_DIALOG))
                        }
                    }/>
                </ContentSection>

            }
        })
        routes.push({
            url: "/task-report-detail",
            render: (props) => {
                return <ContentSection>
                    <TaskReportDetailPageContainer name={COC.TASK_REPORT_DETAIL_PAGE}/>
                </ContentSection>

            }
        })

        routes.push({
            url: "/calendar",
            render: (props) => {
                return <ContentSection>
                    <CalendarTaskPageContainer name={COC.CALENDAR_TASK_PAGE}/>
                </ContentSection>

            }
        })
        routes.push({
            url: "/calendar-task-detail",
            render: (props) => {
                return <ContentSection>
                    <CalendarTaskDetailPageContainer name={COC.CALENDAR_TASK_DETAIL_PAGE}/>
                </ContentSection>

            }
        })

        routes.push({
            url: "/reporting",
            render: (props) => {
                return <ContentSection>
                    <ReportingTaskPageContainer name={COC.REPORTING_TASK_PAGE}/>
                    <ReportTaskDescriptionFormDialog name={COC.REPORT_TASK_DESCRIPTION_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.REPORT_TASK_DESCRIPTION_DIALOG))
                        }
                    }/>
                </ContentSection>

            }
        })

        routes.push({
            url: "/reporting-task-detail",
            render: (props) => {
                return <ContentSection>
                    <ReportingTaskDetailPageContainer name={COC.REPORTING_TASK_DETAIL_PAGE}/>
                </ContentSection>

            }
        })

        routes.push({
            url: "/edit-profile",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/edit-profile: props:", props)
                return <ContentSection>
                    <UserProfileFormContainer name={COC.USER_PROFILE_FORM}/>
                </ContentSection>

            }
        })

        routes.push({
            url: "/notifications-inbox",
            render: (props) => {
                return <ContentSection>
                    <NotificationsPageContainer name={COC.NOTIFICATIONS_PAGE}/>
                </ContentSection>

            }
        })
        routes.push({
            url: "/task-plan-detail",
            render: (props) => {
                return <ContentSection>
                    <TaskPlanDetailPageContainer name={COC.TASK_PLAN_DETAIL_PAGE}/>
                </ContentSection>

            }
        })
        this.state = {
            routes: routes
        }
    }

    componentDidMount() {
        this.props.showLaunchComponent()

    }

    render() {
        logger.debug(logger.CONTENT_MAIN_RENDER, this.props)
        return <div>
            {
                this.state.routes.length > 0 &&
                <Route key={"app_home_route"} dispatch={this.props.dispatch} exact path={this.props.match.url}
                       render={(props) => {
                           return <ContentSection>
                               <CalendarTaskPageContainer name={COC.CALENDAR_TASK_PAGE}/>
                           </ContentSection>

                       }}/>
            }
            {
                this.state.routes.map((route, idx) => <Route key={"app_route" + idx}
                                                             dispatch={this.props.dispatch}
                                                             path={this.props.match.url + route.url}
                                                             render={route.render}/>)

            }
        </div>
    }
}

export default ContentMain
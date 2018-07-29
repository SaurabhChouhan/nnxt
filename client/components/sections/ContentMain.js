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
    LeaveListContainer,
    ReleaseListContainer,
    ReleasePlanSectionContainer,
    ReleaseTaskPlanningPageContainer,
    ReportingTaskDetailPageContainer,
    ReportingTaskPageContainer,
    TechnologyListContainer,
    UserProfileFormContainer,
    LeaveDetailPageContainer,
    DashboardSectionContainer
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
    ReleaseMergeTaskPlanningFormDialog,
    ReleaseTaskPlanningFormDialog,
    RepositoryFeatureDetailDialog,
    RepositoryTaskDetailDialog,
    TechnologyFormDialog,
    LeaveApproveDialog,
    LeaveRejectDialog,
    UpdateReleaseDatesFormDialog,
    EstimationAddToReleaseDialog,
    ReleasePlanAddToReleaseDialog,

} from "../index"
import {Route} from 'react-router-dom'
import * as logger from '../../clientLogger'

class ContentMain extends Component {
    constructor(props) {
        super(props)
        logger.debug(logger.CONTENT_MAIN_LIFECYCLE, 'constructor() called: ', props)
        // All the routes that should be configured based on permissions this user has
        let routes = []

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
                </ContentSection>

            }
        })

        routes.push({
            url: "/release-plan",
            render: (props) => {
                logger.debug(logger.CONTENT_MAIN_RENDER, "/release: props:", props)
                return <ContentSection>
                    <ReleasePlanSectionContainer name={COC.RELEASE_PLAN_LIST}/>
                    <UpdateReleaseDatesFormDialog name={COC.UPDATE_RELEASE_DATES_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.UPDATE_RELEASE_DATES_DIALOG))
                        }
                    }/>
                    <ReleasePlanAddToReleaseDialog name={COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG} show={true}
                                                   close={
                                                       () => {
                                                           this.props.dispatch(A.hideComponent(COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG))
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
                    <ReleaseTaskPlanningFormDialog name={COC.RELEASE_TASK_PLANNING_FORM_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.RELEASE_TASK_PLANNING_FORM_DIALOG))
                        }
                    }/>
                    <ReleaseMergeTaskPlanningFormDialog name={COC.MERGE_TASK_PLANNING_DIALOG} show={true} close={
                        () => {
                            this.props.dispatch(A.hideComponent(COC.MERGE_TASK_PLANNING_DIALOG))
                        }
                    }/>
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
                    <UserProfileFormContainer name={COC.USER_PROFILE_FORM}
                    />
                </ContentSection>

            }
        })

        this.state = {
            routes: routes
        }
    }

    render() {
        logger.debug(logger.CONTENT_MAIN_RENDER, this.props)
        return <div>
            {
                this.state.routes.length > 0 &&
                <Route key={"app_home_route"} dispatch={this.props.dispatch} exact path={this.props.match.url}
                       render={this.state.routes[0].render}/>
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
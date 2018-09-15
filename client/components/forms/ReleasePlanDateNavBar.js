import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderSelect,} from './fields'
import moment from 'moment'
import {connect} from 'react-redux'
import * as SC from '../../../server/serverconstants'
import momentTZ from "moment-timezone";
import {DATE_FORMAT} from "../../../server/serverconstants";

moment.locale('en')

class ReleasePlanDateNavBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expandDescription: false
        }
    }

    componentDidMount() {
        // On task plan load view user would be shown tasks of today's day and beyond
        console.log("componentDidMount ", this.props)
        this.props.fetchReleasePlans(this.props.initialValues)
        this.handleExpandDescriptionCheckBox = this.handleExpandDescriptionCheckBox.bind(this);
    }

    handleExpandDescriptionCheckBox(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            expandDescription: value
        })
        this.props.expandDescription(value)
    }


    render() {
        const {handleSubmit, startDate, devStartDate, devEndDate, endDate, releaseID, change, formValues} = this.props
        let releaseStartMoment = moment(momentTZ.utc(devStartDate).format(DATE_FORMAT))
        let releaseEndMoment = moment(momentTZ.utc(devEndDate).format(DATE_FORMAT))
        let filterStartMoment = startDate ? moment(startDate) : undefined
        let filterEndMoment = endDate ? moment(endDate) : undefined

        console.log("ReleasePlan date nav bar Initial values ", formValues)

        let maxStartMoment = filterEndMoment && filterEndMoment.isValid() ? filterEndMoment : releaseEndMoment
        let minEndMoment = filterStartMoment && filterStartMoment.isValid() ? filterStartMoment : releaseStartMoment

        return <form onSubmit={handleSubmit}>
            <div className="col-md-12 planFilterTaskForm">
                <div className={"col-md-1"}>
                    <button type="button" className="btn filterBtn"
                            onClick={() => {
                                change('startDate', '')
                                change('endDate', '')
                                this.props.fetchReleasePlans(Object.assign({}, formValues, {
                                    startDate: '',
                                    endDate: ''
                                }))
                            }}>Clear Dates
                    </button>
                </div>
                <div className="col-md-5">
                    <div className="col-md-6">
                        <Field name="startDate"
                               placeholder={"Start Date"}
                               component={renderDateTimePickerString}
                               onChange={(event, newValue, oldValue) => {
                                   console.log("onChange() ", releaseID, startDate)
                                   this.props.fetchReleasePlans(Object.assign({}, formValues, {
                                       startDate: newValue
                                   }))
                               }}
                               showTime={false}
                               min={releaseStartMoment.toDate()}
                               max={maxStartMoment.toDate()}
                               label={" Start Date :"}/>
                    </div>
                    <div className="col-md-6">
                        <Field name="endDate" placeholder={" End Date"} component={renderDateTimePickerString}
                               onChange={(event, newValue, oldValue) => {
                                   this.props.fetchReleasePlans(Object.assign({}, formValues, {
                                       endDate: newValue
                                   }))
                               }}
                               showTime={false}
                               min={minEndMoment.toDate()}
                               max={releaseEndMoment.toDate()}
                               label={" End Date :"}/>
                    </div>

                </div>

                <div className="col-md-2">

                    <Field name="status" component={renderSelect} label={"Status"} options={
                        [
                            {_id: SC.STATUS_UNPLANNED, name: SC.STATUS_UNPLANNED},
                            {_id: SC.STATUS_PLANNED, name: SC.STATUS_PLANNED},
                            {_id: SC.STATUS_PENDING, name: SC.STATUS_PENDING},
                            {_id: SC.STATUS_COMPLETED, name: SC.STATUS_COMPLETED}
                        ]
                    } onChange={(event, newValue) => {
                        this.props.fetchReleasePlans(Object.assign({}, formValues, {
                            status: newValue
                        }))
                    }} noneOptionText='All'/>
                </div>
                <div className="col-md-2">
                    <Field name="flag" component={renderSelect} label={"Flag"} options={
                        SC.ALL_WARNING_NAME_ARRAY.map((status, idx) =>
                            ({
                                _id: status,
                                name: status
                            })
                        )
                    } onChange={(event, newValue, oldValue) => {
                        this.props.fetchReleasePlans(Object.assign({}, formValues, {
                            flag: newValue
                        }))
                    }} noneOptionText='All'/>
                </div>
                <div className={"col-md-2 top-label-checkbox"}>
                    <label>
                        Expand Requirement
                    </label>
                    <Field name={"expandDescription"} component="input" onChange={this.handleExpandDescriptionCheckBox}
                           type="checkbox"
                           onChange={(event, newValue) => {
                               this.props.expandReleasePlanDescription(newValue)
                           }
                           }
                    />
                </div>
            </div>
        </form>
    }
}

ReleasePlanDateNavBar = reduxForm({
    form: 'releaseplan-filter'
})(ReleasePlanDateNavBar)


const selector = formValueSelector('releaseplan-filter')

ReleasePlanDateNavBar = connect(
    state => {
        const formValues = selector(state, 'startDate', 'endDate', 'status', 'flag', 'expandDescription', 'releaseID')
        return {
            formValues
        }
    }
)(ReleasePlanDateNavBar)

export default ReleasePlanDateNavBar
import React, {Component} from 'react'
import {renderTextArea,renderSelect} from "./fields"
import {required} from "./validation"
import {Field,reduxForm} from 'redux-form'


class ReportingCommentForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {pristine, submitting} = this.props;
        var priorityStatus = [{'_id': '1', 'title': 'Emergency'},
            {'_id': '2', 'title': 'Critical'},
            {'_id': '3', 'title': 'Urgent'},
            {'_id': '4', 'title': 'Reporting'},
            {'_id': '5', 'title': 'FYI Only'}]
        return (
            <form>
                <div className="col-md-12 pad" style={{marginBottom: '10px'}}>
                    <div className="col-md-8">
                        <Field name="comment" label="" component={renderTextArea} type="text"
                               placeholder="Enter comments or issues here" validate={[required]}/>
                    </div>
                    <div className="col-md-2">
                        <Field name="priority" label="" component={renderSelect} options={priorityStatus}
                               type="text" displayField={'title'} validate={[required]}/>
                    </div>
                    <div className="col-md-2">
                        <button type="submit" disabled={pristine || submitting} className="btn customBtn">Comment</button>
                    </div>
                </div>
            </form>
        )
    }
}

ReportingCommentForm = reduxForm({
    form: 'reporting-comment'
})(ReportingCommentForm)
export default ReportingCommentForm
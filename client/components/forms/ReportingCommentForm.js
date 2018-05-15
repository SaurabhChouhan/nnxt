import React, {Component} from 'react'
import {renderSelect, renderTextArea} from "./fields"
import {required} from "./validation"
import {Field, reduxForm} from 'redux-form'
import * as SC from '../../../server/serverconstants'

class ReportingCommentForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {handleSubmit, pristine, submitting} = this.props;
        let options = [
            {name: SC.COMMENT_EMERGENCY},
            {name: SC.COMMENT_CRITICAL},
            {name: SC.COMMENT_URGENT},
            {name: SC.COMMENT_REPORTING},
            {name: SC.COMMENT_FYI_ONLY}]
        return (
            <form onSubmit={handleSubmit}>
                <div className="col-md-12 pad reportingCommentForm" style={{marginBottom: '10px'}}>

                    <Field name="releasePlanID" component="input" className="form-control" type="hidden"></Field>
                    <Field name="releaseID" component="input" className="form-control" type="hidden"></Field>
                    <div className="col-md-7">
                        <Field name="comment" label="Comment :" component={renderTextArea} type="text"
                               placeholder="Enter comments or issues here" validate={[required]}/>
                    </div>
                    <div className="col-md-3">
                        <Field name="commentType" label="Type :" component={renderSelect} options={options}
                               type="text" displayField='name' valueField='name' validate={[required]}/>
                    </div>
                    <div className="col-md-2 reportingCommentBtn">
                        <button type="submit" disabled={pristine || submitting} className="btn customBtn">Comment
                        </button>
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
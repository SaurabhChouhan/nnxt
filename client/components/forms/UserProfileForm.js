import React, {Component} from 'react'
import {Field, reduxForm, formValueSelector} from 'redux-form'
import {connect} from 'react-redux'
import {renderText, renderTextArea, renderMultiselect} from './fields'
import {required, email, passwordLength,number,phoneNumber} from "./validation"

const passwordMatch = (value, values) => {
    //console.log("pm ", value, values)
    return (values != undefined && values.resetPassword != undefined && values.resetPassword.newPassword != undefined &&
        value != values.resetPassword.newPassword) ? `Should match password value` : undefined
}

class UserProfileForm extends Component {
    constructor() {
        super()
    }

    render() {
        const {handleSubmit, pristine, reset, submitting, addUser, editUser, changeCredentials} = this.props;

        return [
            <h2 key="userProfileFormHeading">This is user profile page</h2>,
            <form key="userProfileForm" onSubmit={this.props.handleSubmit}>
                <div className={"col-md-12"}>
                    <input type="submit" value="SAVE" className="btn squareButton"
                           disabled={pristine || submitting}/>
                    <button onClick={() => this.props.reset()} type="button" className="btn squareButton"
                            disabled={pristine || submitting}>RESET
                    </button>
                </div>
                <div className={"col-md-12"}>
                    <div className="col-md-2">
                        <h4 >User Info</h4>
                        <div>
                            <Field
                                name="firstName"
                                type="text"
                                component={renderText}
                                label="First Name :"
                                className="form-control"/>
                            <Field
                                name="lastName"
                                type="text"
                                component={renderText}
                                label="Last Name :"
                                className="form-control"/><br/>

                            <Field name="_id" component={renderText} className="form-control" type="hidden"/>
                        </div>
                        {/* ending of  section1  */}
                    </div>
                    <div className="col-md-5">
                        <h4>Employee Address</h4>
                        <div >
                            <Field
                                name="employeeAddress.address"
                                type="text"
                                component={renderText}
                                label="Address :"
                                className="form-control"
                                placeholder="Address"

                            />
                            <Field
                                name="employeeAddress.addressCont"
                                type="text"
                                component={renderText}
                                label="Address Cont."
                                className="form-control"
                                placeholder="Address2"
                            />
                            <Field
                                name="employeeAddress.cityStateZip"
                                type="text"
                                component={renderText}
                                label="City/State/Zip:"
                                className="form-control"
                                placeholder="City/Satate/Zip"
                            />
                        </div>
                        {/*Ending of section 2 */}
                    </div>
                    <div className="col-md-5">
                        <h4>Airport Prefrences</h4>
                        <div>
                            <Field
                                name="airportPreference.airport1"
                                type="text"
                                component={renderText}
                                label="Airport 1:"
                                className="form-control"
                                placeholder="Airport 1"
                            />
                            <Field
                                name="airportPreference.airport2"
                                type="text"
                                component={renderText}
                                label="Airport 2:"
                                className="form-control"
                                placeholder="Airport 2"
                            />
                            <Field
                                name="airportPreference.airport3"
                                type="text"
                                component={renderText}
                                label="Airport3"
                                className="form-control"
                                placeholder="Airport 3"
                            />
                        </div>
                        {/*Ending of section 3 */}
                    </div>
                    <div className="col-md-2">
                        <h4 className="orange-heading">Phone Contacts</h4>
                        <div className="grey-outer-field-box">
                            <Field
                                name="phoneContact.home"
                                type="text"
                                component={renderText}
                                label="Home #:"
                                className="form-control"
                                placeholder="Home"
                                validate={[number, phoneNumber]}
                            />
                            <Field
                                name="phoneContact.work"
                                type="text"
                                component={renderText}
                                label="Work #:"
                                className="form-control"
                                placeholder="Work"
                                validate={[number, phoneNumber]}
                            />
                            <Field
                                name="phoneContact.cell"
                                type="text"
                                component={renderText}
                                label="Cell #:"
                                className="form-control"
                                placeholder="Cell"
                                validate={[number, phoneNumber]}
                            />
                            <Field
                                name="phoneContact.other"
                                type="text"
                                component={renderText}
                                label="Other #:"
                                className="form-control"
                                placeholder="Other"
                                validate={[number, phoneNumber]}
                            />
                        </div>
                        {/*Ending of section 4 */}
                    </div>
                    <div className="col-md-3">
                        <h4>Email Contacts</h4>
                        <div >
                            <Field
                                name="emailContact.work"
                                type="text"
                                component={renderText}
                                label="Work:"
                                className="form-control"
                                placeholder="Work"
                                validate={[email]}
                            />
                            <Field
                                name="emailContact.work2"
                                type="text"
                                component={renderText}
                                label="Work2:"
                                className="form-control"
                                placeholder="Work2"
                                validate={[email]}
                            />
                            <Field
                                name="emailContact.other"
                                type="text"
                                component={renderText}
                                label="Other:"
                                className="form-control"
                                placeholder="Other"
                                validate={[email]}
                            />
                        </div>
                        {/*Ending of section 5 */}
                    </div>
                    <div className="col-md-7">
                        <h4 >Emergency contacts</h4>
                        <div >
                            <div className={"col-md-6"}>
                                <Field
                                    name="emergencyContact.name"
                                    type="text"
                                    component={renderText}
                                    label="Name:"
                                    className="form-control"
                                    placeholder="Name"

                                />
                                <Field
                                    name="emergencyContact.relation"
                                    type="text"
                                    component={renderText}
                                    label="Relation :"
                                    className="form-control"
                                    placeholder="Relationship"

                                />
                                <Field
                                    name="emergencyContact.home"
                                    type="text"
                                    component={renderText}
                                    label="Home #:"
                                    className="form-control"
                                    placeholder="Home #"
                                    validate={[number, phoneNumber]}
                                />
                                <Field
                                    name="emergencyContact.work"
                                    type="text"
                                    component={renderText}
                                    label="Work #:"
                                    className="form-control"
                                    placeholder="Work #"
                                    validate={[number, phoneNumber]}
                                />
                            </div>
                            <div className={"col-md-6"}>
                                <Field
                                    name="emergencyContact.cell"
                                    type="text"
                                    component={renderText}
                                    label="Cell #:"
                                    className="form-control"
                                    placeholder="Cell #"
                                    validate={[number, phoneNumber]}
                                />
                                <Field
                                    name="emergencyContact.other"
                                    type="text"
                                    component={renderText}
                                    label="Other #:"
                                    className="form-control"
                                    placeholder="Other #"
                                    validate={[number, phoneNumber]}
                                />
                                <Field
                                    name="emergencyContact.workEmail"
                                    type="text"
                                    component={renderText}
                                    label="Work :"
                                    className="form-control"
                                    placeholder="Work@other.com"
                                    validate={[email]}
                                />
                                <Field
                                    name="emergencyContact.work2Email"
                                    type="text"
                                    component={renderText}
                                    label="Work 2:"
                                    className="form-control"
                                    placeholder="Work@other.other"
                                    validate={[email]}
                                />
                                <Field
                                    name="emergencyContact.otherEmail"
                                    type="text"
                                    component={renderText}
                                    label="Other:"
                                    className="form-control"
                                    placeholder="other@other.other"
                                    validate={[email]}
                                />
                            </div>
                        </div>
                        {/*Ending of section 6 */}
                    </div>
                    <div className="col-md-3">
                        {/*Ending of section 7 */}
                    </div>
                    <div className="col-md-6">
                        <h4 >Account Numbers</h4>
                        <div>
                            <div className={"col-md-6"}>
                                <Field
                                    name="accountNumbers.tsaPreCheckNumber"
                                    type="text"
                                    component={renderText}
                                    label="TSA Pre Check Number:"
                                    className="form-control"
                                    placeholder="Name"
                                    validate={[number]}
                                />
                                <Field
                                    name="accountNumbers.marriotRewardNumber"
                                    type="text"
                                    component={renderText}
                                    label="Marriot Reward Number:"
                                    className="form-control"
                                    placeholder="Marriot Reward "
                                    validate={[number]}
                                />
                                <Field
                                    name="accountNumbers.deltaSkymilesNumber"
                                    type="text"
                                    component={renderText}
                                    label="Delta Skymiles Number:"
                                    className="form-control"
                                    placeholder="Skymiles Number 3"
                                    validate={[number]}
                                />
                                <Field
                                    name="accountNumbers.unitedExplorerClubNumber"
                                    type="text"
                                    component={renderText}
                                    label="United Explorer Club Number:"
                                    className="form-control"
                                    placeholder="United Explorer Club Number"
                                    validate={[number]}
                                />
                            </div>
                            <div className={"col-md-6"}>
                                <Field
                                    name="accountNumbers.southwestRapidRewardsNumber"
                                    type="text"
                                    component={renderText}
                                    label="Southwest Rapid Rewards Number:"
                                    className="form-control"
                                    placeholder=" Southwest Rapid Rewards Number "
                                    validate={[number]}
                                />
                                <Field
                                    name="accountNumbers.advantageNumber"
                                    type="text"
                                    component={renderText}
                                    label="Advantage Number:"
                                    className="form-control"
                                    placeholder="AAdvantage Number"
                                    validate={[number]}
                                />
                                <Field
                                    name="accountNumbers.emeroldClubNumber"
                                    type="text"
                                    component={renderText}
                                    label="Emerold Club Number:"
                                    className="form-control"
                                    placeholder=" Emerold Club Number "
                                    validate={[number]}
                                />
                                <Field
                                    name="accountNumbers.enterprisePlusNumber"
                                    type="text"
                                    component={renderText}
                                    label="Enterprise Plus Number:"
                                    className="form-control"
                                    placeholder="Enterprise Plus Number"
                                    validate={[number]}
                                />
                            </div>
                        </div>
                        {/*Ending of section 8 */}
                    </div>
                    <div className={"row"}>
                        <div className="col-md-3">
                            <span >Reset Password</span>
                            <span >
                            <label><Field name="changeCredentials" component="input" type="checkbox"/></label>
                            </span>
                            {(changeCredentials) &&
                            <div>

                                <Field
                                    name="resetPassword.oldPassword"
                                    type="password"
                                    component={renderText}
                                    label="Old Password :"
                                    className="form-control"
                                    placeholder="Old Password"
                                    validate={[passwordLength]}
                                />

                                <Field
                                    name="resetPassword.newPassword"
                                    type="password"
                                    component={renderText}
                                    label="New Password:"
                                    className="form-control"
                                    placeholder="New Password"
                                    validate={[passwordLength]}
                                />

                                <Field
                                    name="resetPassword.confirmPassword"
                                    type="password"
                                    component={renderText}
                                    label="Confirm_Password:"
                                    className="form-control"
                                    placeholder="New Password"
                                    validate={[passwordLength, passwordMatch]}
                                />
                            </div>}
                        </div>
                        {/*Ending of section 9 */}
                    </div>


                </div>
            </form>
        ]
    }
}

UserProfileForm = reduxForm({
    form: 'user-profile'
})(UserProfileForm)

const selector = formValueSelector('user-profile');

UserProfileForm = connect(
    state => {
        const changeCredentials = selector(state, 'changeCredentials')
        return {changeCredentials};
    }
)(UserProfileForm)
export default UserProfileForm
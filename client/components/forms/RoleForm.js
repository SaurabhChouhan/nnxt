import React from 'react'
import {
    reduxForm,
    Field,
    Form,
    FieldArray,
    formValueSelector,
    change,
    arrayPush,
    reset,
    arrayRemove,
    arrayInsert
} from 'redux-form'
import {renderText, renderSelect, renderCheckBox} from "./fields"
import {required} from "./validation"
import {connect} from 'react-redux'
import _ from 'lodash'

let PermissionRow = (props) => {
    console.log("props is ", props)

    if (props.permission) {
        return <tr>
            <td>{props.permission.name}</td>
            <td>{props.permission.configurable ? 'true' : 'false'}</td>
            <td>{props.permission.enabled ? 'true' : 'false'}</td>
            <td>
                <button className="glyphicon glyphicon-pencil pull-left btn btn-custom" type="button"
                        onClick={() => {
                            props.editPermission(props.permission, props.idx)

                        }}>
                </button>
            </td>
            <td>
                <button className="glyphicon glyphicon-trash pull-left btn btn-custom" type="button"
                        onClick={() => {
                            props.removePermission('permissions', props.idx)
                        }}>
                </button>
            </td>
        </tr>
    }

    return undefined


}

let PermissionForm = (props) => {
    return <Form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="_id" component={renderSelect} options={props.options}
                       displayField="name" valueField="_id" label="Permissions:" validate={[required]} onChange={
                    (event, newValue, oldValue) => {
                        console.log("onChange ", newValue)
                        props.change('name', props.permissions.find(p => p._id == newValue).name)
                    }
                }/>
            </div>

            <div style={{"paddingTop": "25px"}}>
                <div className="col-md-2">
                    <Field name="configurable" component={renderCheckBox} type="checkbox" label="Configurable"/>
                </div>
                <div className="col-md-2">
                    <Field name="enabled" component={renderCheckBox} type="checkbox" label="Enabled"/>
                </div>
                <div className="col-md-2">
                    <button type="button" className="btn btn-submit" onClick={() => {
                        props.submit()
                    }}>{props.selectedPermission ? 'Edit' : 'Add'}
                    </button>
                    <button style={{"marginLeft": "5px"}} type="button" onClick={() => {
                        props.initialize({})
                        props.changeFuncParent('selectedPermission', null)
                    }} className="btn btn-submit">Reset
                    </button>
                </div>
            </div>
        </div>
    </Form>
}

PermissionForm = reduxForm({
    form: 'role-permission'
})(PermissionForm)

PermissionForm = connect(state => ({}),
    dispatch => ({
        onSubmit: (values) => {

            console.log("Permission Form values ", values)

            if (typeof(values.selectedIdx) != 'undefined') {
                // permission was edited
                dispatch(arrayRemove('role', 'permissions', values.selectedIdx))
                dispatch(arrayInsert('role', 'permissions', values.selectedIdx, values))
            } else {
            dispatch(arrayPush('role', 'permissions', values))
            }

            dispatch(change('role', 'selectedPermission', null))
            dispatch(reset('role-permission'))
        }
    })
)(PermissionForm)


let RoleForm = (props) => {
    const {roleSyncErrors, change, push, touch, array, untouch, submit, reset} = props
    const {permissions, permissionFormValues, permissionsAdded} = props
    return [
        <div key="RoleFormBackButton">
            <button type="button"
                    onClick={() => props.showRoleList() }>
                <i className="glyphicon glyphicon-arrow-left"></i>
            </button>
        </div>,
        <Form key="RoleForm" onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-4">
                <Field name="name" placeholder={"Role name"} component={renderText}
                       label={"Role:"} validate={[required]}/>
            </div>
        </div>
        <PermissionForm key="RolePermissionForm" options={props.permissionOptions} permissions={props.permissions}
                        selectedPermission={props.selectedPermission} changeFuncParent={props.change}/>
        <div className="row">
            <div className="col-md-8">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Permission Name</th>
                        <th>Configurable</th>
                        <th>Enabled</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {Array.isArray(permissionsAdded) && permissionsAdded.length > 0 ?
                        permissionsAdded.map((p, idx) => <PermissionRow key={"permissionrow_" + idx}
                                                                        permission={p} idx={idx}
                                                                        removePermission={props.array.remove}
                                                                        editPermission={props.editPermission}
                        />) : undefined
                    }
                    </tbody>
                </table>
            </div>
        </div>

        {/*<FieldArray component={renderPermissionComponent} {...props} name="permissions"/>*/}
        <div className="row" key="RoleFormSubmission">
            <div className="col-md-6">
                <button type="button" onClick={() => {
                    submit()
                }} className="btn btn-submit">Submit
                </button>
                <button style={{"marginLeft": "5px"}} type="button" onClick={() => {
                    reset()
                }} className="btn btn-submit">Reset
                </button>
            </div>
        </div>
    </Form>]
}

RoleForm = reduxForm({
    form: 'role'
})(RoleForm)

export default RoleForm
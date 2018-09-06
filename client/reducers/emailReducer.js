import * as AC from "../actions/actionConsts"
import * as SC from "../../server/serverconstants";


let initialState = {
}

export const emailReducer = (state = initialState, action) => {
    switch (action.type) {

        case AC.ADD_ALL_EMAIL_TEMPLATES:
            return Object.assign({}, state, {allEmailTemplates: action.allEmailTemplates})

        case AC.ADD_ALL_EMAIL_TEMPLATES_TYPES:
            return Object.assign({}, state, {allEmailTemplatesTypes: action.allEmailTemplatesTypes})

        case AC.ADD_EMAIL_TEMPLATE:
            return Object.assign({}, state, {newEmailTemplate: [...state.all, action.newEmailTemplate]})

        case AC.ADD_IS_EMAIL_TEMPLATE_TYPE_EXIST:
            return Object.assign({}, state, {isEmailTemplateTypeExist: action.isEmailTemplateTypeExist})

        case AC.ADD_IS_EMAIL_TEMPLATE_NAME_EXIST:
            return Object.assign({}, state, {isEmailTemplateNameExist: action.isEmailTemplateNameExist})

        default:
            return state
    }
}

export default emailReducer
import * as AC from "../actions/actionConsts"
import * as SC from "../../server/serverconstants";


let initialState = {
}

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_ALL_EMAIL_TEMPLATES:
            return Object.assign({}, state, {all: action.allEmailTemplates})

        case AC.ADD_EMAIL_TEMPLATE:
            return Object.assign({}, state, {all: [...state.all, action.newEmailTemplate]})

        case AC.ADD_ALL_EMAIL_SUBJECTS:
            return Object.assign({}, state, {allSubjects: action.allEmailTemplateSubjects})

        case AC.ADD_EMAIL_SUBJECT:
            return Object.assign({}, state, {allSubjects: [...state.allSubjects, action.emailSubject]})

        default:
            return state
    }
}

export default userReducer
import * as AC from "../actions/actionConsts"


let initialState = {
    all: [],
    selected: {}
}

const attendanceSettingReducer = (state = initialState, action) => {
    switch (action.type) {
        case AC.ADD_UPDATE_ATTENDENCE_SETTING:
            return Object.assign({}, state, {
                    selected:Object.assign(action.attendanceSetting)
                }
            )
        default:
            return state
    }
}

export default attendanceSettingReducer
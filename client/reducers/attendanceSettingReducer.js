import * as AC from "../actions/actionConsts"


let initialState = {
    all: [],
    selected: {}
}

const attendenceSettingReducer = (state = initialState, action) => {
    switch (action.type) {

        case AC.ADD_UPDATE_ATTENDENCE_SETTING:

            return Object.assign({}, state, {
                    all: (Array.isArray(state.all) && state.all.length > 0) ?
                        state.all.map(item => (item._id == action.attendenceSetting._id) ? action.attendenceSetting : item)

                        : [action.attendenceSetting]
                }
            )


        default:
            return state
    }
}

export default attendenceSettingReducer
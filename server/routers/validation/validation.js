import t from 'tcomb-validation'
import {API_VALIDATION_FAILED, HTTP_BAD_REQUEST} from "../../errorcodes"
import _ from 'lodash'

/**
 * Required string rule
 */
export let RequiredString = t.refinement(t.String, s => _.trim(s).length > 0)
RequiredString.getValidationErrorMessage = (value, path, context) => {
    if (!value || _.trim(value).length == 0)
        return path.join("/") + ' is Required'
}

class ValidationError extends Error {
    constructor(message, errors) {
        super(message)
        this.errors = errors
        this.code = API_VALIDATION_FAILED
        this.status = HTTP_BAD_REQUEST
    }
}

export const validate = (input, rule) => {
    let result = t.validate(input, rule)
    if (!result.isValid()) {
        let errors = result.errors.map(e => {
            return {
                message: e.message,
                path: e.path.join("/")
            }
        })
        throw new ValidationError('Validation failed', errors)
    }
    return
}


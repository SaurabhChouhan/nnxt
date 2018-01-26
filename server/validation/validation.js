import t from 'tcomb-validation'
import {API_VALIDATION_FAILED, HTTP_BAD_REQUEST} from "../errorcodes"
import _ from 'lodash'
import mongoose from 'mongoose'

/**
 * Required string rule
 */

/*
t.String.getValidationErrorMessage = (value, path, context) => {
    if (!value)
        return path.join("/") + ' is Required'
}
*/

export {default as generateSchema} from './generateSchema'

export let RequiredString = t.refinement(t.String, s => _.trim(s).length > 0, "String")

export let ObjectId = t.refinement(t.String, s => mongoose.Types.ObjectId.isValid(s), "ObjectID")

t.String.getValidationErrorMessage = (value, path, context) => {
    if(!value)
        return "Field is required"
    else if(typeof(value) != 'string')
        return "Value ["+value+"] not a valid string"
}

RequiredString.getValidationErrorMessage = (value, path, context) => {
    if (!value || _.trim(value).length == 0)
        return "A non-empty value is required"
}

ObjectId.getValidationErrorMessage = (value, path, context) => {
    return "Value ["+value+"] is not a valid Mongo Object ID"
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



/*
,
    notes: t.maybe(t.list(
        t.struct({
            name: RequiredString,
            note: RequiredString
        }))
    )

 */
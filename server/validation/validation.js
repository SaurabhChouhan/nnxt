import t from 'tcomb-validation'
import * as EC from '../errorcodes'
import _ from 'lodash'
import mongoose from 'mongoose'
import Moment from 'moment-timezone'
import {DATE_FORMAT, DEFAULT_TIMEZONE} from '../serverconstants'

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

export let RequiredString = t.refinement(t.String, s => _.trim(s).length > 0, 'String')

export let ObjectId = t.refinement(t.String, s => mongoose.Types.ObjectId.isValid(s), 'ObjectID')

export let validDate = t.refinement(t.String, s => {
    console.log('validDate: s is ', s)
    let m = Moment.tz(s, DATE_FORMAT, DEFAULT_TIMEZONE)
    console.log('validDate: s is ', s)
    console.log('moment is ', m)
    console.log('is valid ', m.isValid())
    return m.isValid()
}, 'validDate')

t.Nil.getValidationErrorMessage = (value, path, context) => {
    if (value != null && value != undefined)
        return 'Unexpected field: This field is not allowed'
}

t.String.getValidationErrorMessage = (value, path, context) => {
    if (!value)
        return 'Field is required'
    else if (typeof(value) != 'string')
        return 'Value [' + value + '] not a valid string'
}

RequiredString.getValidationErrorMessage = (value, path, context) => {
    if (!value || _.trim(value).length == 0)
        return 'A non-empty value is required'
}

ObjectId.getValidationErrorMessage = (value, path, context) => {
    return 'Value [' + value + '] is not a valid Mongo Object ID'
}


class ValidationError extends Error {
    constructor(message, errors) {
        super(message)
        this.errors = errors
        this.code = EC.API_VALIDATION_FAILED
        this.status = EC.HTTP_BAD_REQUEST
    }
}

export const validate = (input, rule) => {
    let result = t.validate(input, rule)
    if (!result.isValid()) {
        let errors = result.errors.map(e => {
            return {
                message: e.message,
                path: e.path.join('/')
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
import React from 'react'
import moment from 'moment';
import Multiselect from 'react-widgets/lib/Multiselect'
import DateTimePicker from 'react-widgets/lib/DateTimePicker'
import _ from 'lodash'
/*
Form Field components
 */

export const renderText = ({
                               input,
                               label,
                               readOnly = false,
                               disbled = false,
                               type,
                               placeholder,
                               meta: {touched, error, warning}
                           }) =>
    <div className="form-group">
        <label htmlFor={input.name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
              {error}
            </span>))
        }</label>
        <input {...input} readOnly={readOnly} disabled={disbled} placeholder={placeholder} type={type}
               className={'form-control ' + (touched && ((!error && 'valid-field') || (error && 'invalid-field')))}/>
    </div>

export const renderCheckBox = ({
                                   input,
                                   label,
                                   readOnly,
                                   className = "input checkbox",
                                   meta: {touched, error, warning}
                               }) =>
    <div className={className}>
        {touched &&
        ((error &&
            <span className="validation-error">
              {error}
            </span>))
        }
        <label>
            <input {...input} readOnly={readOnly} checked={input && input.value ? true : false}
                   onChange={input.onChange} type="checkbox"/>
            {label}
        </label>

    </div>
/*
export const renderCheckBox = ({
                                   input,
                                   label,
                                   readOnly,
                                   meta: {touched, error, warning}
                               }) =>
            <div className="input checkbox">
        {touched &&
        ((error &&
            <span className="validation-error">
        {error}
            </span>))
        }
         <label>
             <input {...input} readOnly={readOnly} type="checkbox"/>
              {label}
            </label>

                </div>*/

export const renderSelect = ({
                                 input,
                                 onChange,
                                 label,
                                 options,
                                 readOnly = false,
                                 noneOptionText = 'Select ...',
                                 noneOptionValue = '',
                                 showNoneOption = true,
                                 displayField = 'name',
                                 optionalDisplayField = 'name',
                                 disabled = false,
                                 valueField = "_id",
                                 hoverEnabledMsg,
                                 hoverDisabledMsg,
                                 meta: {touched, error, warning}
                             }) => {

    return <div className="form-group" style={{position: "relative"}}>
        <label htmlFor={input.name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
            {error}
          </span>))
        }</label>
        <select {...input}
                className={"form-control hoverTooltip " + (touched && ((!error && "valid-field") || (error && "invalid-field")))}
                disabled={disabled} readOnly={readOnly}>
            {showNoneOption && <option value={noneOptionValue}>{noneOptionText}</option>}
            {
                options && options.map(option => {
                        return <option value={_.get(option, valueField)}
                                       key={option[valueField]}>{_.get(option, displayField) ? _.get(option, displayField) : _.get(option, optionalDisplayField)}</option>
                    }
                )
            }
        </select>
        {hoverEnabledMsg && <span className="enabledMsg">{hoverEnabledMsg}</span>}
        {hoverDisabledMsg && <span className="disabledMsg">{hoverDisabledMsg}</span>}
    </div>
}

export const renderSelectForEmailTemplateType = ({
                                 input,
                                 onChange,
                                 label,
                                 options,
                                 readOnly = false,
                                 noneOptionText = 'Select All',
                                 noneOptionValue = 'undefined',
                                 showNoneOption = true,
                                 displayField = 'name',
                                 optionalDisplayField = 'name',
                                 disabled = false,
                                 valueField = "_id",
                                 hoverEnabledMsg,
                                 hoverDisabledMsg,
                                 meta: {touched, error, warning}
                             }) => {

    return <div className="form-group" style={{position: "relative"}}>
        <label htmlFor={input.name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
            {error}
          </span>))
        }</label>
        <select {...input}
                className={"form-control hoverTooltip " + (touched && ((!error && "valid-field") || (error && "invalid-field")))}
                disabled={disabled} readOnly={readOnly}>
            {showNoneOption && <option value={noneOptionValue}>{noneOptionText}</option>}
            {
                options && options.map(option => {
                        return <option value={_.get(option, valueField)}
                                       key={option[valueField]}>{_.get(option, displayField) ? _.get(option, displayField) : _.get(option, optionalDisplayField)}</option>
                    }
                )
            }
        </select>
        {hoverEnabledMsg && <span className="enabledMsg">{hoverEnabledMsg}</span>}
        {hoverDisabledMsg && <span className="disabledMsg">{hoverDisabledMsg}</span>}
    </div>
}


export const renderTextArea = ({
                                   input,
                                   label,
                                   placeholder,
                                   disabled = false,
                                   readOnly = false,
                                   rows,
                                   hoverEnabledMsg,
                                   hoverDisabledMsg,
                                   meta: {touched, error, warning}
                               }) =>
    <div className="form-group">
        <label htmlFor={input.name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
            {error}
          </span>))
        }</label>
        <textarea rows={rows} {...input} placeholder={placeholder} readOnly={readOnly} disabled={disabled}
                  className={"form-control hoverToolTip " + (touched && ((!error && "valid-field") || (error && "invalid-field")))}></textarea>
    </div>
export const renderError = ({
                                input,
                                label,
                                meta: {touched, error, warning}
                            }) =>
    <h3><span className="label label-danger">{error}</span></h3>

export const renderLoginField = ({
                                     input,
                                     label,
                                     readOnly,
                                     type,
                                     placeholder,
                                     meta: {touched, error, warning}
                                 }) =>
    <div className="col-md-12">
        <label htmlFor={input.name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
              {error}
            </span>))
        }</label>
        <input {...input} className="form-control" type={type}/>
    </div>

export const renderMultiSelect = ({
                                      input,
                                      data,
                                      valueField = "_id",
                                      disabled = false,
                                      textField = "name",
                                      label,
                                      placeholder,
                                      defaultValue,
                                      meta: {touched, error, warning}
                                  }) => {
                                      console.log("default value is ", defaultValue)
                                      console.log("data is ", data)
    return <div className="form-group">
        <label htmlFor={input.name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
                {error}
            </span>))
        }</label>
        <Multiselect {...input}
                     onBlur={() => input.onBlur()}
                     value={input.value || defaultValue || []} // requires value to be an array
                     data={data}
                     disabled={disabled}
                     valueField={valueField}
                     label={label}
                     textField={textField}
                     placeholder={placeholder}
        />
    </div>
                                  }

export const renderField = ({
                                input,
                                label,
                                readOnly,
                                type,
                                placeholder,
                                meta: {touched, error, warning},
                                disabled = false
                            }) =>
    <div className="form-group">
        <label htmlFor={input.name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
              {error}
            </span>))
        }</label>
        <input {...input} readOnly={readOnly} disabled={disabled} placeholder={placeholder} type={type}
               className={'form-control ' + (touched && ((!error && 'valid-field') || (error && 'invalid-field')))}/>
    </div>

export const renderDateTimePickerString = ({
                                               input: {onChange, value, name, onBlur},
                                               label,
                                               readOnly,
                                               timeZone = 'America/New_York',
                                               dropUp = false,
                                               info,
                                               showTime = false,
                                               showCalendar = true,
                                               min,
                                               max,
                                               type,
                                               placeholder,
                                               disabled = false,
                                               currentDate,
                                               meta: {touched, error, warning},
                                               hoverEnabledMsg,
                                               hoverDisabledMsg,
                                               displayFormat = 'DD/MM/YYYY',
                                               valueFormat = 'YYYY-MM-DD'

                                           }) => {

    let val = undefined

    console.log("renderDateTimePickerString", value)

    if (value) {
        if (showCalendar && showTime)
            val = moment(value, valueFormat).toDate()
        else if (showCalendar)
            val = moment(value, valueFormat).toDate()
        else if (showTime)
            val = moment(value, valueFormat).toDate()
    }

    const parse = event => {
        if (event) {
            if (showCalendar) {
                if (showTime) {
                    if (typeof(event) === 'object' && event.target && event.target.value) {
                        console.log("renderDateTimePickerString->parse(event.target.value)", event.target.value)
                        let v = moment(event.target.value, displayFormat).format(valueFormat)
                        return v
                    } else {
                        console.log("renderDateTimePickerString->parse(event)", event)
                        let v = moment(event, displayFormat).format(valueFormat)
                        return v
                    }
                } else {
                    if (typeof(event) === 'object' && event.target && event.target.value) {
                        console.log("renderDateTimePickerString->parse(event.target.value)", event.target.value)
                        let v = moment(event.target.value, displayFormat).format(valueFormat)
                        return v
                    } else {
                        let v = moment(event, displayFormat).format(valueFormat)
                        console.log("renderDateTimePickerString->parse(event)", event)
                        return v
                    }
                }
            } else {
                if (showTime) {
                    if (typeof(event) === 'object' && event.target && event.target.value) {
                        if (event.target.value.length == 7)
                            event.target.value = '0' + event.target.value
                        return event.target.value;
                    } else {
                        if (event && event.length == 7)
                            event = '0' + event
                        let v = moment(event).format(valueFormat)
                        return v
                    }
                }
            }
        }
        return undefined
    }

    return <div className="form-group" style={{position: "relative"}}>
        <label htmlFor={name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
            {error}
          </span>))

        }{(info &&
            <span className="field-info">
            {info}
          </span>)}</label>
        <DateTimePicker
            className=" hoverTooltip"
            min={min}
            max={max}
            readOnly={readOnly}
            disabled={disabled}
            onChange={event => onChange(parse(event))}
            // onBlur={event => onBlur(parse(event))}
            time={showTime}
            calendar={showCalendar}
            value={val}
            dropUp={dropUp}
            format={displayFormat}
            currentDate={currentDate}
            onKeyPress={event => event.preventDefault()}
            onKeyDown={event => event.preventDefault()}
        />
        {hoverEnabledMsg && <span className="enabledMsg" style={{width: 250}}>{hoverEnabledMsg}</span>}
        {hoverDisabledMsg && <span className="disabledMsg">{hoverDisabledMsg}</span>}

    </div>
}

export const renderDateTimePicker = ({
                                         input: {onChange, value, name, onBlur},
                                         label,
                                         readOnly,
                                         info,
                                         showTime,
                                         showCalendar,
                                         min,
                                         max,
                                         type,
                                         dropUp = false,
                                         placeholder,
                                         disabled = false,
                                         meta: {touched, error, warning}
                                     }) => {
    return <div className="form-group">
        <label htmlFor={name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
            {error}
          </span>))

        }{(info &&
            <span className="field-info">
            {info}
          </span>)}</label>
        <DateTimePicker
            min={min}
            max={max}
            format={'MM-DD-YYYY'}
            readOnly={readOnly}
            disabled={disabled}
            onChange={onChange}
            onBlur={onBlur}
            time={showTime}
            calendar={showCalendar}
            value={!value ? null : new Date(value)}

        />
    </div>
}


export const renderDateTimeStringShow = ({
                                             input: {onChange, value, name},
                                             label,
                                             readOnly,
                                             info,
                                             showTime,
                                             showCalendar,
                                             min,
                                             max,
                                             formate = "DD-MM-YYYY",
                                             type,
                                             dropUp = false,
                                             placeholder,
                                             disabled = false,
                                             meta: {touched, error, warning}
                                         }) => {
    // console.log("value", value)
    return <div className="form-group">
        <label htmlFor={name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
            {error}
          </span>))

        }{(info &&
            <span className="field-info">
            {info}
          </span>)}</label>
        <label>{moment(value).format(formate)}</label>
    </div>
}


/*
export const renderDateTimePickerWithLeave = ({
                                                  input: {onChange, value, name},
                                                  label,
                                                  readOnly,
                                                  info,
                                                  showTime = false,
                                                  showCalendar,
                                                  leaveDays = ["Sunday", "Saturday"],
                                                  min,
                                                  max,
                                                  type,
                                                  dropUp = false,
                                                  placeholder,
                                                  disabled = false,
                                                  meta: {touched, error, warning}
                                              }) => {

    const filter = event => {
        if (event) {
            console.log("event", event)
             console.log("event.target.value", event.target.value)
             if (showCalendar) {
                 if (showTime) {
                     console.log("under Development")
                 } else {
                     if (typeof(event) === 'object' && event.target && event.target.value) {
                         let v = moment(event.target.value).format('YYYY-MM-DD')
                         return v
                     } else {
                         let v = moment(event).format('YYYY-MM-DD')
                         return v
                     }
                 }
             } else {
                 if (showTime) {
                     if (typeof(event) === 'object' && event.target && event.target.value) {
                         if (event.target.value.length == 7)
                             event.target.value = '0' + event.target.value
                         return event.target.value;
                     } else {
                         if (event && event.length == 7)
                             event = '0' + event
                         let v = moment(event).format('YYYY-MM-DD')
                         return v
                     }
                 }
             }
            console.log("moment(event).format", moment(event).format('YYYY-MM-DD'))
            console.log("day", moment("9-18-2016").format('dddd'))
            console.log("day Comparision", _.includes(leaveDays, moment("9-18-2016").format('dddd')))
            console.log(" new Date(event).getDay()", new Date(event).getDay())

            //  console.log("moment(event).format",_.include("") moment(event).hour(0).minute(0).second(0).millisecond(0))
            return moment(event).format('YYYY-MM-DD')
        }
        return undefined
    }
    return <div className="form-group">
        <label htmlFor={name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
            {error}
          </span>))

        }{(info &&
            <span className="field-info">
            {info}
          </span>)}</label>
        <DateTimePicker
            min={min}
            max={max}
            format={'MM-DD-YYYY'}
            readOnly={readOnly}
            disabled={disabled}
            onChange={event => onChange(filter(event))}
            time={showTime}
            calendar={showCalendar}
            value={!value ? null : new Date(value)}

        />
    </div>
}
*/
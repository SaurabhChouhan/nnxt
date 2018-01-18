import React from 'react'
import Multiselect from 'react-widgets/lib/Multiselect'
/*
Form Field components
 */

export const renderText = ({
                               input,
                               label,
                               readOnly,
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
        <input {...input} readOnly={readOnly} placeholder={placeholder} type={type}
               className={'form-control ' + (touched && ((!error && 'valid-field') || (error && 'invalid-field')))}/>
    </div>

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

    </div>


export const renderSelect = ({
                                 input,
                                 onChange,
                                 label,
                                 options,
                                 readOnly = false,
                                 noneOptionText = 'Select ...',
                                 showNoneOption = true,
                                 displayField = 'name',
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
            {showNoneOption && <option value="">{noneOptionText}</option>}
            {
                options && options.map(option =>
                    <option value={option[valueField]} key={option[valueField]}>{option[displayField]}</option>
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
        <textarea rows={rows} {...input} placeholder={placeholder} disabled={disabled}
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

export const renderMultiselect = ({input, data, valueField, textField, label, placeholder, meta: {touched, error, warning}, disabled = false,}) =>
    <div className="form-group">
        <label htmlFor={input.name}>{label} {touched &&
        ((error &&
            <span className="validation-error">
                {error}
            </span>))
        }</label>
        <Multiselect {...input}
                     onBlur={() => input.onBlur()}
                     value={input.value || []} // requires value to be an array
                     data={data}
                     disabled={disabled}
                     valueField={valueField}
                     label={label}
                     textField={textField}
                     placeholder={placeholder}
        />
    </div>

export const renderField = ({
                                input,
                                label,
                                readOnly,
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
        <input {...input} readOnly={readOnly} placeholder={placeholder} type={type}
               className={'form-control ' + (touched && ((!error && 'valid-field') || (error && 'invalid-field')))}/>
    </div>



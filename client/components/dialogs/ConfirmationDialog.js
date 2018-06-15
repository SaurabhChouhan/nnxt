import {Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle} from 'react-bootstrap'
import React from 'react'
import * as SC from '../../../server/serverconstants'

const ConfirmationRequestReviewDialog = (props) => {
    const {show, onClose, body,hasError, title} = props
    return <Modal show={show} onHide={onClose}>
        {<ModalHeader
            className={hasError ? " confirmationDialogReviewRequestHasError " : "confirmationDialogReviewRequestNoError"}>
            <ModalTitle>{title ? title : 'Confirm Operation'}</ModalTitle>
            {hasError ? <img key="exclaimation" className=" errorClass confirmationDialogErrorImg"
                             src="/images/exclamation.png" title="Error Detected"/> : null}
        </ModalHeader>
        }
        {<ModalBody
            className={hasError ? "confirmationDialogBodyHasError " : "confirmationDialogBodyNoError"}>
            {body ? body : 'Please confirm or cancel operation'}
        </ModalBody>
        }
        {
            <ModalFooter
                className={hasError ? "confirmationDialogFooterHasError " : "confirmationDialogFooterNoError"}>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={props.onConfirm}>Confirm</Button>
            </ModalFooter>
        }
    </Modal>
}


const defaultConfirmationDialog = (props) => {
    const {show, onClose,body, hasError, title} = props
    return <Modal show={show} onHide={onClose}>
        {
            <ModalHeader>
                <ModalTitle>{title ? title : 'Confirm Operation'}</ModalTitle>
            </ModalHeader>
        }
        {
            <ModalBody>
                {body ? body : 'Please confirm or cancel operation'}
            </ModalBody>
        }
        {
            <ModalFooter>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={props.onConfirm}>Confirm</Button>
            </ModalFooter>
        }
    </Modal>
}

const ConfirmationDialog = (props) => {
    const {dialogName} = props
    switch (dialogName) {
        case SC.DIALOG_ESTIMATION_REQUEST_REVIEW:
            return ConfirmationRequestReviewDialog(props)
        default:
            return defaultConfirmationDialog(props)
    }

}
export default ConfirmationDialog


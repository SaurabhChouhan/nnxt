import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {LeaveRequestFormContainer} from "../../containers"

const LeaveRequestFormDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3>Raise Leave</h3>
        </ModalHeader>
        <ModalBody>
            <LeaveRequestFormContainer/>
        </ModalBody>
    </Modal>
}

export default LeaveRequestFormDialog
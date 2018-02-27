import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {ReleaseTaskPlanningFormContainer} from "../../containers"

const ReleaseTaskPlanningFormDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3>Add Task Planning</h3>
        </ModalHeader>
        <ModalBody>
            <ReleaseTaskPlanningFormContainer/>
        </ModalBody>
    </Modal>
}

export default ReleaseTaskPlanningFormDialog
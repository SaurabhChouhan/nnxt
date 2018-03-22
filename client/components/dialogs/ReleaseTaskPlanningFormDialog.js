import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {ReleaseTaskPlanningFormContainer} from "../../containers"

const ReleaseTaskPlanningFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add Task Planning</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ReleaseTaskPlanningFormContainer/>
        </ModalBody>
    </Modal>
}

export default ReleaseTaskPlanningFormDialog
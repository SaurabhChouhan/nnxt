import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {ReleaseTaskPlanningShiftFormContainer} from "../../containers"

const TaskShiftDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Shift Task</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ReleaseTaskPlanningShiftFormContainer/>
        </ModalBody>
    </Modal>
}

export default TaskShiftDialog
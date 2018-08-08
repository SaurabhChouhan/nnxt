import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {ReleaseMoveTaskPlanFormContainer} from "../../containers"

const ReleaseMoveTaskPlanFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Move Task</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ReleaseMoveTaskPlanFormContainer/>
        </ModalBody>
    </Modal>
}

export default ReleaseMoveTaskPlanFormDialog
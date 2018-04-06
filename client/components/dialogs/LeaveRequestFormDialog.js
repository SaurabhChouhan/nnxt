import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {LeaveRequestFormContainer} from "../../containers"

const LeaveRequestFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Raise Leave</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <LeaveRequestFormContainer/>
        </ModalBody>
    </Modal>
}

export default LeaveRequestFormDialog
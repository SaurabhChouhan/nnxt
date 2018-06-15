import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {LeaveDetailContainer} from "../../containers"

const LeaveDetailDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Leave Detail</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <LeaveDetailContainer/>
        </ModalBody>
    </Modal>
}

export default LeaveDetailDialog
import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {LeaveApprovalReasonFormContainer} from "../../containers"

const LeaveRejectDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Leave Reject</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <h4>Are you sure you want to <b> Reject </b>this leave. Please confirm!
            </h4>
            <LeaveApprovalReasonFormContainer isApproved={false}/>
        </ModalBody>
    </Modal>
}

export default LeaveRejectDialog
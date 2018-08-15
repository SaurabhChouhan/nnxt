import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {ReportTaskDescriptionFormContainer} from "../../containers"

const ReportTaskDescriptionFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Report Details</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ReportTaskDescriptionFormContainer/>
        </ModalBody>
    </Modal>
}

export default ReportTaskDescriptionFormDialog
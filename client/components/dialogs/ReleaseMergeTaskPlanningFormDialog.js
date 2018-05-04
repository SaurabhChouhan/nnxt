import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {ReleaseMergeTaskPlanningFormContainer} from "../../containers"

const ReleaseMergeTaskPlanningFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Merge Planning To Date</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ReleaseMergeTaskPlanningFormContainer/>
        </ModalBody>
    </Modal>
}

export default ReleaseMergeTaskPlanningFormDialog
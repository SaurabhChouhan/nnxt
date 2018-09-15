import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {UpdateReleasePlanFormContainer} from "../../containers"

const UpdateReleasePlanFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add To ReleasePlan</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <UpdateReleasePlanFormContainer/>
        </ModalBody>
    </Modal>
}

export default UpdateReleasePlanFormDialog
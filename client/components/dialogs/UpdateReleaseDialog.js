import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {UpdateReleaseFormContainer} from "../../containers"

const UpdateReleaseDialog = (props) => {
    return <Modal className=" estimationModal " show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Update Release</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <UpdateReleaseFormContainer/>
        </ModalBody>
    </Modal>
}

export default UpdateReleaseDialog
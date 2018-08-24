import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {CreateReleaseFormContainer} from "../../containers"

const CreateReleaseDialog = (props) => {
    return <Modal className=" estimationModal " show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Create Release</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <CreateReleaseFormContainer/>
        </ModalBody>
    </Modal>
}

export default CreateReleaseDialog
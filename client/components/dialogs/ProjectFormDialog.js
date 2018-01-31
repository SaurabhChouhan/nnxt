import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {ProjectFormContainer} from "../../containers"

const ProjectFormDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3>Add Project</h3>
        </ModalHeader>
        <ModalBody>
            <ProjectFormContainer/>
        </ModalBody>
    </Modal>
}

export default ProjectFormDialog
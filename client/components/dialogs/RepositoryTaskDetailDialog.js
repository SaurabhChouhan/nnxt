import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {RepositoryTaskDetailPageContainer} from "../../containers"

const RepositoryTaskDetailDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Task Detail Page</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <RepositoryTaskDetailPageContainer/>
        </ModalBody>
    </Modal>
}

export default RepositoryTaskDetailDialog
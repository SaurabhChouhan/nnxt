import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {RepositoryFeatureDetailPageContainer} from "../../containers"

const RepositoryFeatureDetailDialog = (props) => {
    return <Modal  className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Feature Detail Page</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <RepositoryFeatureDetailPageContainer/>
        </ModalBody>
    </Modal>
}

export default RepositoryFeatureDetailDialog
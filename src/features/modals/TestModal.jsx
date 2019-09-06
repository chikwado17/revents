import React from 'react';
import { connect } from 'react-redux';
import { closeModal } from './modalActions';
import { Modal } from 'semantic-ui-react';



const mapDispatchToProps = (dispatch) => ({

  closeModal: () => dispatch(closeModal())
});


const TestModal = (props) => {
  return (
    <Modal closeIcon="close" open={true} onClose={props.closeModal}>
        <Modal.Header>Test Modal</Modal.Header>
        <Modal.Content>
        <Modal.Description>
            <p>Test Modal... nothing to see here</p>
        </Modal.Description>
        </Modal.Content>
    </Modal>
  )
}

export default connect(null,mapDispatchToProps)(TestModal);

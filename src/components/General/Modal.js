import { Modal, Button } from 'flowbite-react';
import { Navigate } from 'react-router-dom';

export const CustomModal = ({
  title,
  message1,
  message2,
  show,
  setShow,
  dismissable = true,
}) => {
  return (
    <Modal
      show={show}
      size="md"
      dismissible={dismissable}
      onClose={() => {
        setShow(false);
      }}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {message1}
          </p>
          <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
            {message2}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setShow(false);
          }}
        >
          Okay
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

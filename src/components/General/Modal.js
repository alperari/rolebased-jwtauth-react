import { Modal, Button, Label, TextInput, Textarea } from 'flowbite-react';
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
      {dismissable && (
        <Modal.Footer>
          <Button
            onClick={() => {
              setShow(false);
            }}
          >
            Okay
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export const AddCommentModal = ({
  show,
  setShow,
  setComments,
  size = 'md',
  dismissable = true,
  onSubmit,
}) => {
  return (
    <Modal
      show={show}
      size={size}
      dismissible={dismissable}
      onClose={() => {
        setShow(false);
      }}
    >
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={onSubmit}>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Leave a comment for this product
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="comment" value="Your comment" />
              </div>
              <Textarea
                id="comment"
                placeholder="Leave a comment..."
                required={true}
                rows={4}
              />
            </div>

            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

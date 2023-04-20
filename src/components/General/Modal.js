import {
  Modal,
  Button,
  Label,
  TextInput,
  Textarea,
  Spinner,
} from 'flowbite-react';
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

export const CustomProcessingModal = ({
  title,
  message1,
  message2,
  show,
  setShow,
  dismissable = false,
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
      <Modal.Header className="flex flex-row   bg-gray-100">
        <Spinner color="purple" /> {title}
      </Modal.Header>
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const title = e.target.title.value;
            const description = e.target.description.value;
            onSubmit(title, description);
          }}
        >
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Leave a comment for this product
            </h3>
            <div>
              <div className="mb-2 block flex flex-col gap-1">
                <Label htmlFor="title" value="Title" />
                <TextInput id="title" type="text" required={true} />
              </div>

              <div className="mb-2 block">
                <Label htmlFor="description" value="Description" />
              </div>
              <Textarea
                id="description"
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

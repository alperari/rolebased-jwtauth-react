import { Alert } from 'flowbite-react';

export const AlertSuccess = ({ title, message }) => {
  return (
    <Alert color="success">
      <span>
        <span className="font-medium">{title}</span>
        <span> {message}</span>
      </span>
    </Alert>
  );
};

export const AlertFailure = ({ title, message }) => {
  return (
    <Alert color="failure">
      <span>
        <span className="font-medium">{title}</span>
        <span> {message}</span>
      </span>
    </Alert>
  );
};

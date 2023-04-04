import React, { useState } from 'react';
import { Button, TextInput, Label, Checkbox, Card } from 'flowbite-react';
import { useUserContext } from '../../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';
import { AlertSuccess, AlertFailure } from '../General/Alert';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const RegisterCard = () => {
  const { user, register } = useUserContext();
  const [errorMessage, setErrorMessage] = React.useState('');
  const [showAlert, setShowAlert] = useState(false);

  const navigate = useNavigate();

  return (
    <Card>
      <form
        className="flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const displayName = e.target.displayName.value;
          const username = e.target.username.value;
          const address = e.target.address.value;
          const email = e.target.email.value;
          const password1 = e.target.password1.value;
          const password2 = e.target.password2.value;

          if (password1 !== password2) {
            setErrorMessage('Passwords do not match.');
            return;
          }

          const registerResponse = await register(
            displayName,
            username,
            email,
            password1,
            address
          );

          if (registerResponse.success) {
            setShowAlert(true);
            await delay(1000);

            navigate('/login');
          } else {
            setErrorMessage(registerResponse.message);
          }
        }}
      >
        {showAlert && (
          <AlertSuccess title="Register Successful!" message="Redirecting..." />
        )}
        <div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="displayName" value="display name" />
            </div>
            <TextInput
              id="displayName"
              type="text"
              required={true}
              shadow={true}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="username" />
            </div>
            <TextInput
              id="username"
              type="text"
              required={true}
              shadow={true}
            />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="email" value="Your email" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="example@mail.com"
            required={true}
            shadow={true}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="address" value="address" />
          </div>
          <TextInput id="address" type="text" required={true} shadow={true} />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput
            id="password1"
            type="password"
            required={true}
            shadow={true}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password2" value="Repeat password" />
          </div>
          <TextInput
            id="password2"
            type="password"
            required={true}
            shadow={true}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox id="agree" />
          <Label htmlFor="agree">I agree with the terms and conditions</Label>
        </div>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button type="submit">Register new account</Button>
      </form>
    </Card>
  );
};

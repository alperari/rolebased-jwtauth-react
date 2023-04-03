import React, { useState } from 'react';
import { Button, TextInput, Label, Checkbox, Card } from 'flowbite-react';
import { useUserContext } from '../../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { user, login } = useUserContext();
  const [errorMessage, setErrorMessage] = React.useState('');

  const navigate = useNavigate();

  return (
    <Card>
      <form
        className="w-64 flex flex-col gap-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const email = e.target.email1.value;
          const password = e.target.password1.value;

          const loginResponse = await login(email, password);

          if (loginResponse.success) {
            navigate('/');
          } else {
            setErrorMessage(loginResponse.message);
          }
        }}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="example@gmail.com"
            required={true}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="password1" value="Your password" />
          </div>
          <TextInput id="password1" type="password" required={true} />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>

        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

        <Button type="submit">Submit</Button>
      </form>
    </Card>
  );
};

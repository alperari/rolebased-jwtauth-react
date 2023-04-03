import React from 'react';
import { Button, TextInput, Label, Checkbox, Card } from 'flowbite-react';
import { useUserContext } from '../../hooks/useUserContext';

export const Login = () => {
  const { user, login } = useUserContext();

  return (
    <Card>
      <form
        className="w-64 flex flex-col gap-4"
        onSubmit={(e) => {
          login({ username: 'alper', age: 25 });
        }}
      >
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1" value="Your email" />
          </div>
          <TextInput
            id="email1"
            type="email"
            placeholder="name@flowbite.com"
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
        <Button type="submit">Submit</Button>
      </form>
    </Card>
  );
};

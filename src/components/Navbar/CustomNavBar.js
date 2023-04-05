import React from 'react';
import { Dropdown, Button, Navbar, Avatar } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserProvider } from '../../providers/UserProvider';
import { useUserContext } from '../../hooks/useUserContext';

const user = JSON.parse(localStorage.getItem('user'));

const CustomNavBar = () => {
  const { logout } = useUserContext();

  const navigate = useNavigate();

  const onLoginClick = () => {
    navigate('/login');
  };

  const onRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div class="border-b-2 border-solid border-gray-200">
      <Navbar fluid={true} rounded={true} class="my-4 mx-6">
        <Navbar.Brand href="/">
          <img
            src="https://cdn.iconscout.com/icon/free/png-256/protein-supplements-1901761-1607960.png"
            className="mr-3 h-6 sm:h-9"
            alt="Flowbite Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Protein Dude
          </span>
        </Navbar.Brand>

        <div className="flex md:order-2">
          {user && (
            <>
              <div class=" mr-3 flex flex-row items-center">{user.name}</div>
              <Dropdown
                arrowIcon={false}
                inline={true}
                label={<Avatar size="md" />}
              >
                <Dropdown.Header>
                  <span className="block text-sm">{user.name}</span>
                  <span className="block truncate text-sm font-medium">
                    {user.email}
                  </span>
                </Dropdown.Header>
                <Dropdown.Item>
                  <Link to="/user" className="block w-full">
                    {' '}
                    Profile{' '}
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={async () => {
                    await logout();
                    window.location.reload();
                  }}
                >
                  <div class="text-red-500">Log Out</div>
                </Dropdown.Item>
              </Dropdown>
            </>
          )}

          {!user && (
            <div class="flex flex-row space-x-2 items-center">
              <Button
                onClick={onRegisterClick}
                outline={true}
                gradientDuoTone="pinkToOrange"
              >
                Register
              </Button>
              <Button onClick={onLoginClick} gradientDuoTone="pinkToOrange">
                Login
              </Button>
            </div>
          )}
        </div>

        <Navbar.Collapse>
          <Navbar.Link href="/" active={true}>
            Home
          </Navbar.Link>
          <Navbar.Link href="/categories">Categories</Navbar.Link>
          <Navbar.Link href="/add-product">Add Product</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNavBar;

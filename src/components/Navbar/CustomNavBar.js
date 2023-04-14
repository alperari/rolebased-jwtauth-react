import React from 'react';
import { Dropdown, Button, Navbar, Avatar } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

import { IoBagHandle, IoCart } from 'react-icons/io5';

import { UserProvider } from '../../providers/UserProvider';
import { useUserContext } from '../../hooks/useUserContext';
import { CartHover } from '../Cart/CartHover';

const user = JSON.parse(localStorage.getItem('user'));
const cart = JSON.parse(localStorage.getItem('cart'));

const CustomNavBar = () => {
  const { logout } = useUserContext();
  const [cartState, setCartState] = React.useState(cart || {});

  const navigate = useNavigate();

  const onLoginClick = () => {
    navigate('/login');
  };

  const onRegisterClick = () => {
    navigate('/register');
  };

  React.useEffect(() => {
    // Event listener for storage event
    // Update cart state when cart is updated in another tab
    window.addEventListener('storage', () => {
      setCartState(JSON.parse(localStorage.getItem('cart')));
    });
  }, []);

  const UserSection = () => {
    return (
      <div class="flex flex-row items-center">
        <div class=" mr-3 flex flex-row items-center">{user.name}</div>
        <Dropdown arrowIcon={false} inline={true} label={<Avatar size="md" />}>
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
      </div>
    );
  };

  console.log(cartState);
  return (
    <div class="fixed inset-x-0 top-0 left-0 z-10 w-full bg-white border-b-2 border-solid border-gray-200">
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

        <div className="flex md:order-2 items-center gap-2 justify-center">
          <Dropdown
            class=" items-center jutify-center m-0 p-0 flex flex-col"
            size="s"
            label={
              cartState && cartState.products.length > 0 ? (
                <div class="relative ">
                  <div class="absolute left-3 bottom-3">
                    <p class="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                      {cartState.products.reduce((acc, curr) => {
                        return acc + curr.cartQuantity;
                      }, 0)}
                    </p>
                  </div>

                  <IoCart className="text-2xl text-gray-500 mr-4" />
                </div>
              ) : (
                <IoCart className="text-2xl text-gray-500 mr-4" />
              )
            }
            arrowIcon={false}
          >
            <CartHover></CartHover>
          </Dropdown>

          <Link to="/wishlist">
            <IoBagHandle className="text-2xl text-gray-500 mr-4" />
          </Link>

          {user && <UserSection />}

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

          <Navbar.Link href="/comments">
            {user && (user.role === 'salesManager' || user.role === 'admin')
              ? 'Comments'
              : 'My Comments'}
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNavBar;

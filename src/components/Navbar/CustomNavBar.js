import React from 'react';
import { Dropdown, Button, Navbar, Avatar, Badge } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

import { IoBagHandle, IoCart, IoReceipt } from 'react-icons/io5';
import { AiOutlineHistory, AiFillPieChart } from 'react-icons/ai';
import { FaCommentDots } from 'react-icons/fa';
import { MdAddBox, MdCategory, MdHome } from 'react-icons/md';
import { BsCreditCardFill } from 'react-icons/bs';
import { RiRefund2Line } from 'react-icons/ri';

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
        <div class=" mr-3 flex flex-col justify-center items-end">
          {user.name}{' '}
          {user && user.role !== 'customer' && (
            <Badge color="purple" size="sm">
              {user.role}
            </Badge>
          )}
        </div>
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
          {!user || (user && user.role === 'customer') ? (
            <Dropdown
              class=" items-center jutify-center m-0 p-0 flex flex-col"
              size="s"
              label={
                cartState?.products?.length > 0 ? (
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
              <CartHover cart={cartState}></CartHover>
            </Dropdown>
          ) : null}

          {user && user.role === 'customer' && (
            <Link to="/wishlist">
              <IoBagHandle className="text-2xl text-gray-500 mr-4" />
            </Link>
          )}

          {user && user.role === 'customer' && (
            <Link to="/order-history">
              <AiOutlineHistory className="text-2xl text-gray-500 mr-4" />
            </Link>
          )}

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
            <div class="flex flex-row items-center gap-1 py-2">
              Home
              <MdHome size={20} />
            </div>
          </Navbar.Link>
          <Navbar.Link href="/categories">
            <div class="flex flex-row items-center gap-1 py-2">
              Categories
              <MdCategory size={20} />
            </div>
          </Navbar.Link>

          {user && (user.role === 'admin' || user.role == 'productManager') && (
            <Navbar.Link href="/add-product">
              <div class="flex flex-row items-center gap-1 py-2">
                Add Product
                <MdAddBox size={20} />
              </div>
            </Navbar.Link>
          )}

          {user && (user.role === 'admin' || user.role == 'productManager') && (
            <Navbar.Link href="/comments">
              <div class="flex flex-row gap-1 py-2 px-4 bg-gray-100 rounded-3xl font-semibold ">
                Comments
                <FaCommentDots size={20} />
              </div>
            </Navbar.Link>
          )}

          {user && user.role === 'customer' && (
            <Navbar.Link href="/comments">
              <div class="flex flex-row gap-1 py-2 rounded-3xl font-semibold ">
                My Comments
                <FaCommentDots size={20} />
              </div>
            </Navbar.Link>
          )}

          {user &&
            (user.role === 'admin' || user.role === 'productManager') && (
              <Navbar.Link href="/orders">
                <div class="flex flex-row gap-1 py-2 px-4 bg-gray-100 rounded-3xl font-semibold ">
                  Orders
                  <BsCreditCardFill size={20} />
                </div>
              </Navbar.Link>
            )}

          {user && (user.role === 'admin' || user.role == 'salesManager') && (
            <Navbar.Link href="/refunds">
              <div class="flex flex-row gap-1 py-2 px-4 bg-gray-100 rounded-3xl font-semibold ">
                Refunds
                <RiRefund2Line size={20} />
              </div>
            </Navbar.Link>
          )}

          {user && (user.role === 'admin' || user.role == 'salesManager') && (
            <Navbar.Link href="/invoices/all">
              <div class="flex flex-row gap-1 py-2 px-4 bg-gray-100 rounded-3xl font-semibold ">
                Invoices
                <IoReceipt size={20} />
              </div>
            </Navbar.Link>
          )}

          {user && (user.role === 'admin' || user.role == 'salesManager') && (
            <Navbar.Link href="/sales">
              <div class="flex flex-row gap-1 py-2 px-4 bg-gray-100 rounded-3xl font-semibold ">
                Sales
                <AiFillPieChart size={20} />
              </div>
            </Navbar.Link>
          )}

          {user && user.role === 'customer' && (
            <Navbar.Link href="/refunds">
              <div class="flex flex-row gap-1 py-2 rounded-3xl font-semibold ">
                My Refunds
                <RiRefund2Line size={20} />
              </div>
            </Navbar.Link>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default CustomNavBar;

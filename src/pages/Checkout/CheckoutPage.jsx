import _ from 'lodash';

import React, { useEffect, useState } from 'react';
import { Label } from 'flowbite-react';
import { HiOutlinePencil, HiX, HiCheck } from 'react-icons/hi';

import { Button, TextInput } from 'flowbite-react';

import { CartService } from '../../services/CartService';
import { OrderService } from '../../services/OrderService';

import { CheckoutProduct } from '../../components/Checkout/CheckoutProduct';

import {
  CustomModal,
  CustomProcessingModal,
} from '../../components/General/Modal';

const user = JSON.parse(localStorage.getItem('user'));
const cart = JSON.parse(localStorage.getItem('cart')) || {};

const modalDisplayTime = 5000; // 1 second

const CheckoutPage = () => {
  const [cartState, setCartState] = useState(cart);

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const [contact, setContact] = useState(user.name || '');
  const [address, setAddress] = useState(user.address || '');

  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fetchCartUpdateLocalStorage = async () => {
    const fetchedCart = await CartService.getCart();

    // If any of product details are changed in db, update the cart
    if (!_.isEqual(cart, fetchedCart)) {
      // Update local storage
      localStorage.setItem('cart', JSON.stringify(fetchedCart));

      // Dispatch event
      window.dispatchEvent(new Event('storage'));

      // Update cart state
      setCartState(fetchedCart);
    }
  };

  const calculateTotalCost = () => {
    let totalCost = 0;
    cartState.products.forEach((product) => {
      let cost = product.cartQuantity * product.price;
      cost = cost - cost * (product.discount / 100);
      totalCost += cost;
    });

    return totalCost;
  };

  useEffect(() => {
    fetchCartUpdateLocalStorage();

    // let timeout;
    // if (showProcessingModal) {
    //   timeout = setTimeout(() => {
    //     setShowProcessingModal(false);
    //     // history.push('/newpage')
    //   }, modalDisplayTime);
    // }
    // return () => clearTimeout(timeout);
  }, [showProcessingModal, showErrorModal, showSuccessModal]);

  const ContactSection = () => {
    return (
      <div class="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
        <div class="w-full flex mb-3 items-center">
          <div class="flex flex-row gap-2 items-center ">
            <Button
              size="xs"
              color="light"
              disabled={isEditingContact}
              onClick={(e) => {
                e.preventDefault();
                setIsEditingContact(true);
              }}
            >
              <HiOutlinePencil size={15} />
            </Button>
            <span class="text-gray-600 font-semibold">Contact</span>
          </div>
          <div class="flex-grow pl-3 items-center">
            {isEditingContact ? (
              <div class="flex flex-row gap-2 items-center">
                <form
                  class="flex flex-row gap-2 items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const contact = e.target.contact.value;

                    if (contact) {
                      setContact(contact);
                    }
                    setIsEditingContact(false);
                  }}
                >
                  <TextInput id="contact" size="xs" placeholder={contact} />
                  <div class="flex flex-row gap-2">
                    <Button type="submit" size="xs" color="light">
                      <HiCheck size={15} />
                    </Button>
                    <Button
                      size="xs"
                      color="light"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditingContact(false);
                      }}
                    >
                      <HiX size={15} />
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <span>{contact}</span>
            )}
          </div>
        </div>

        <div class="w-full flex items-center">
          <div class="flex flex-row gap-2 items-center">
            <Button
              size="xs"
              color="light"
              disabled={isEditingAddress}
              onClick={(e) => {
                e.preventDefault();
                setIsEditingAddress(true);
              }}
            >
              <HiOutlinePencil size={15} />
            </Button>
            <span class="text-gray-600 font-semibold">Billing Address</span>
          </div>
          <div class="overflow-auto pl-3">
            {isEditingAddress ? (
              <div class="flex flex-row gap-2 items-center">
                <form
                  class="flex flex-row gap-2 items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const address = e.target.address.value;

                    if (address) {
                      setAddress(address);
                    }
                    setIsEditingAddress(false);
                  }}
                >
                  <TextInput id="address" placeholder={address} />
                  <div class="flex flex-row gap-2">
                    <Button type="submit" size="xs" color="light">
                      <HiCheck size={15} />
                    </Button>
                    <Button
                      size="xs"
                      color="light"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsEditingAddress(false);
                      }}
                    >
                      <HiX size={15} />
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <span class="break-words">{address}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div class="min-w-screen min-h-screen bg-gray-50 p-12">
      <h1 class="text-3xl md:text-5xl mb-4 font-bold text-gray-600">
        Checkout.
      </h1>

      <CustomProcessingModal
        title="Processing your order..."
        message1="⌛ This might take a while."
        message2="Please don't close this window."
        show={showProcessingModal}
        setShow={setShowProcessingModal}
      />

      <CustomModal
        title="Payment Successful"
        message1=""
        message2=""
        show={showSuccessModal}
        setShow={setShowSuccessModal}
      />

      <CustomModal
        title="Payment Failed"
        message1=""
        message2=""
        show={showErrorModal}
        setShow={setShowErrorModal}
      />

      <div class="w-full bg-white border-t border-b border-r border-l border-gray-200 px-5 py-10 text-gray-800">
        <div class="w-full">
          <div class="-mx-3 md:flex items-start">
            <div class="px-3 md:w-7/12 lg:pr-10">
              <div class="w-full mx-auto text-gray-800 font-light mb-6 border-b border-gray-200 pb-6 flex flex-col gap-4">
                {cartState?.products &&
                  cartState.products.length > 0 &&
                  cartState.products.map((product) => {
                    return <CheckoutProduct product={product} />;
                  })}
              </div>
              <div class="mb-6 pb-6 border-b border-gray-200">
                <div class="-mx-2 flex items-end justify-end">
                  <div class="flex-grow px-2 lg:max-w-xs">
                    <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">
                      Discount code
                    </label>
                    <div>
                      <input
                        class="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                        placeholder="XXX-XXX"
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="px-2">
                    <button
                      class="block w-full max-w-xs mx-auto border border-transparent bg-gray-400 hover:bg-gray-500 focus:bg-gray-500 text-white rounded-md px-5 py-2 font-semibold"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowProcessingModal(true);
                      }}
                    >
                      APPLY
                    </button>
                  </div>
                </div>
              </div>
              <div class="mb-6 pb-6 border-b border-gray-200 text-gray-800">
                <div class="w-full flex mb-3 items-center">
                  <div class="flex-grow">
                    <span class="text-gray-600">Subtotal</span>
                  </div>
                  <div class="pl-3">
                    <span class="font-semibold">
                      ${calculateTotalCost().toFixed(2)}
                    </span>
                  </div>
                </div>
                <div class="w-full flex items-center">
                  <div class="flex-grow">
                    <span class="text-gray-600">Shipping</span>
                  </div>
                  <div class="pl-3">
                    <span class="font-semibold">$4.99</span>
                  </div>
                </div>
              </div>
              <div class="mb-6 pb-6 border-b border-gray-200 md:border-none text-gray-800 text-xl">
                <div class="w-full flex items-center">
                  <div class="flex-grow">
                    <span class="text-gray-600">Total</span>
                  </div>
                  <div class="pl-3">
                    <span class="font-semibold text-gray-400 text-sm">USD</span>{' '}
                    <span class="font-semibold">
                      ${(calculateTotalCost() + 4.99).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-3 md:w-5/12">
              <ContactSection />

              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  setShowProcessingModal(true);

                  const nameOnCard = e.target.nameOnCard.value;
                  const cardNumber = e.target.cardNumber.value;
                  const expireMonth = e.target.expireMonth.value;
                  const expireYear = e.target.expireYear.value;
                  const cvv = e.target.cvv.value;

                  if (!address || !contact) {
                    return alert(
                      'Please fill out delivery address and contact person'
                    );
                  }

                  // Prepare products
                  const products = cartState.products.map((product) => {
                    let cost = product.price * product.cartQuantity;
                    cost = cost - cost * (product.discount / 100);

                    return {
                      productID: product._id,
                      quantity: product.cartQuantity,
                      buyPrice: cost,
                    };
                  });

                  // Place order
                  const order = await OrderService.placeOrder({
                    address: address,
                    creditCard: cardNumber,
                    productxxs: products,
                  });

                  setShowProcessingModal(false);

                  if (order.error) {
                    setShowErrorModal(true);
                  } else {
                    setShowSuccessModal(true);
                  }
                }}
              >
                <div class="w-full mx-auto rounded-lg bg-white border border-gray-200 text-gray-800 font-light mb-6">
                  <div class="w-full p-3 border-b border-gray-200">
                    <div class="mb-5 flex flex-col gap-4">
                      <Label
                        for="type1"
                        class="flex items-center cursor-pointer"
                      >
                        <input
                          type="radio"
                          class="form-radio h-5 w-5 text-indigo-500"
                          name="type"
                          id="type1"
                          checked
                        />
                        <img
                          src="https://leadershipmemphis.org/wp-content/uploads/2020/08/780370.png"
                          class="h-6 ml-3"
                        />
                      </Label>
                      <div class="w-full ">
                        <label
                          for="type2"
                          class="flex items-center cursor-pointer"
                        >
                          <input
                            type="radio"
                            class="form-radio h-5 w-5 text-indigo-500"
                            name="type"
                            id="type2"
                          />
                          <img
                            src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                            width="80"
                            class="ml-3"
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <div class="mb-3">
                        <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">
                          Name on card
                        </label>
                        <div>
                          <input
                            id="nameOnCard"
                            class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="John Smith"
                            type="text"
                            required
                          />
                        </div>
                      </div>
                      <div class="mb-3">
                        <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">
                          Card number
                        </label>
                        <div>
                          <input
                            id="cardNumber"
                            class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                            placeholder="0000 0000 0000 0000"
                            type="text"
                            required
                          />
                        </div>
                      </div>
                      <div class="mb-3 -mx-2 flex items-end">
                        <div class="px-2 w-1/4">
                          <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">
                            Expiration date
                          </label>
                          <div>
                            <select
                              id="expireMonth"
                              class="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                            >
                              <option value="01">01 - January</option>
                              <option value="02">02 - February</option>
                              <option value="03">03 - March</option>
                              <option value="04">04 - April</option>
                              <option value="05">05 - May</option>
                              <option value="06">06 - June</option>
                              <option value="07">07 - July</option>
                              <option value="08">08 - August</option>
                              <option value="09">09 - September</option>
                              <option value="10">10 - October</option>
                              <option value="11">11 - November</option>
                              <option value="12">12 - December</option>
                            </select>
                          </div>
                        </div>
                        <div class="px-2 w-1/4">
                          <select
                            id="expireYear"
                            class="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                          >
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                            <option value="2027">2027</option>
                            <option value="2028">2028</option>
                            <option value="2029">2029</option>
                          </select>
                        </div>
                        <div class="px-2 w-1/4">
                          <label class="text-gray-600 font-semibold text-sm mb-2 ml-1">
                            CVV
                          </label>
                          <div>
                            <input
                              id="cvv"
                              class="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors"
                              placeholder="000"
                              type="text"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  class="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-2 font-semibold"
                >
                  <i class="mdi mdi-lock-outline mr-1"></i> PAY NOW
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

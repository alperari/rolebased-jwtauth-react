import React, { useEffect, useState } from 'react';
import { Label } from 'flowbite-react';
import { HiOutlinePencil, HiX, HiCheck } from 'react-icons/hi';
import { TbCurrentLocation, TbHistory } from 'react-icons/tb';

import { Button, TextInput } from 'flowbite-react';

import { useParams, useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const { orderId } = useParams();

  console.log(orderId);
  return (
    <div>
      <h1>Order Page</h1>
    </div>
  );
};

export default OrderPage;

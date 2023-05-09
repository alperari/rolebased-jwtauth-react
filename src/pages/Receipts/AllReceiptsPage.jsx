import React, { useEffect, useState } from 'react';
import { Button, TextInput, Label } from 'flowbite-react';

import { OrderService } from '../../services/OrderService';

import { Link, useNavigate } from 'react-router-dom';

const AllReceiptsPage = () => {
  const [loading, setLoading] = useState(false);
  const [receipts, setReceipts] = useState([]);

  const navigate = useNavigate();

  const fetchAllReceipts = async () => {
    setLoading(true);

    const fetchedReceipts = await OrderService.getAllReceipts();
    setReceipts(fetchedReceipts);

    setLoading(false);

    console.log(fetchedReceipts);
  };

  useEffect(() => {
    fetchAllReceipts();
  }, []);

  return <div>receipts</div>;
};

export default AllReceiptsPage;

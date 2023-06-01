import React, { useEffect, useState } from 'react';
import { TextInput, Label, Table, Button, Card } from 'flowbite-react';
import { AiFillFilePdf } from 'react-icons/ai';

import { OrderService } from '../../services/OrderService';
import { RefundService } from '../../services/RefundService';

import { IntervalPicker } from '../../components/Product/DatePicker';

import { Link, useNavigate } from 'react-router-dom';
import {
  parseDateTime,
  getDateDaysAgo,
  convertDateToDDmmYYYY,
} from '../../helpers/helperFunctions';

const SalesPage = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div class="flex flex-col mx-32 py-12">
      <span class="font-semibold text-3xl text-center">
        Sales / Profit / Loss
      </span>
      <span class="font text-l text-center mb-4">
        You can view detailed information about sales and profit/loss here.
      </span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <div class="flex flex-col">chart comes here</div>
      )}
    </div>
  );
};

export default SalesPage;

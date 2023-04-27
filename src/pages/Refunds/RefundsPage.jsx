import React, { useEffect, useState } from 'react';
import { HiCalendar } from 'react-icons/hi';

import { Button, Card } from 'flowbite-react';

import { RefundService } from '../../services/RefundService';

import { useParams, useNavigate } from 'react-router-dom';

import { parseDateTime } from '../../helpers/helperFunctions';

const user = JSON.parse(localStorage.getItem('user'));

const RefundsPage = () => {
  return 'refunds page';
};

export default RefundsPage;

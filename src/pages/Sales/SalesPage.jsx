import React, { useEffect, useState } from 'react';
import { TextInput, Label, Table, Button, Card, Spinner } from 'flowbite-react';
import { AiFillFilePdf } from 'react-icons/ai';

import { ProductService } from '../../services/ProductService';
import { OrderService } from '../../services/OrderService';
import { RefundService } from '../../services/RefundService';

import { IntervalPicker } from '../../components/Product/DatePicker';
import { CustomBarChart } from '../../components/Order/CustomBarChart';
import { CustomPieChart } from '../../components/Sales/CustomPieChart';

import { Link, useNavigate } from 'react-router-dom';
import {
  parseDateTime,
  get30DaysArray,
  getDaysInInterval,
  convertDateToDDmmYYYY,
  getDateDaysAgo,
} from '../../helpers/helperFunctions';

const SalesPage = () => {
  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [refunds, setRefunds] = useState([]);

  const [cost, setCost] = useState(0);

  const [startDate, setStartDate] = useState(getDateDaysAgo(30));
  const [endDate, setEndDate] = useState(getDateDaysAgo(0));

  const fetchActiveOrders = async () => {
    setLoading(true);

    const fetchedOrders = await OrderService.getActiveOrders();
    setOrders(fetchedOrders);

    console.log(fetchedOrders);

    setLoading(false);
  };

  const fetchApprovedRefunds = async () => {
    setLoading(true);

    const fetchedRefunds = await RefundService.getApprovedRefunds();
    setRefunds(fetchedRefunds);

    setLoading(false);
  };

  //   const fetchProductsCalculateCost = async () => {
  //     setLoading(true);
  //     const products = await ProductService.getProducts();

  //     let totalCost = 0;

  //     products.forEach((product) => {
  //       totalCost += product.cost;
  //     });
  //     console.log('totalCost:', totalCost);
  //     setCost(totalCost);

  //     setLoading(false);
  //   };

  useEffect(() => {
    fetchActiveOrders();
    fetchApprovedRefunds();
    // fetchProductsCalculateCost();
  }, []);

  const IntervalSection = () => {
    return (
      <div class="flex flex-col items-center gap-2 mb-8">
        <IntervalPicker
          color={'blue'}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />
        <Button.Group>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              const oldestReceiptDate = new Date(
                orders.slice(-1)[0].date.split('T')[0]
              );
              const oldestReceiptDateWithoutTime = new Date(
                oldestReceiptDate.getFullYear(),
                oldestReceiptDate.getMonth(),
                oldestReceiptDate.getDate()
              );
              setStartDate(oldestReceiptDateWithoutTime);
              setEndDate(getDateDaysAgo(0));
            }}
          >
            All
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(90 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 90 Days
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(30 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 30 Days
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(15 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 15 Days
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(7 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 7 Days
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={() => {
              setStartDate(getDateDaysAgo(3 - 1));
              setEndDate(getDateDaysAgo(0));
            }}
          >
            Last 3 Days
          </Button>
        </Button.Group>
      </div>
    );
  };

  const SalesSection = () => {
    if (loading) {
      return (
        <Card>
          <div class="text-md text-gray-900 font-bold text-center flex gap-2 justify-center flex-row">
            Loading sales <Spinner size="lg" />
          </div>
        </Card>
      );
    } else {
      // Get days in selected interval (as array of strings)
      const daysInSelectedIntervalArray = getDaysInInterval(startDate, endDate);

      const datasetRevenues = daysInSelectedIntervalArray.map((day) => {
        const salesOnThatDay = orders.filter((sale) => {
          // each sale looks like {date: '2023-05-04', quantity: 1, buyPrice: 75.99}
          return sale.date.split('T')[0] === day;
        });

        if (salesOnThatDay.length > 0) {
          return salesOnThatDay.reduce((acc, sale) => {
            const subTotal = sale.products.reduce((acc, product) => {
              return acc + product.buyPrice;
            }, 0);
            return acc + subTotal;
          }, 0);
        } else {
          return 0;
        }
      });

      const options_revenues = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          //   title: {
          //     display: true,
          //     text: 'Revenues',
          //   },
        },
        scales: {
          y: {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, ticks) {
                return '$' + value;
              },
            },
          },
        },
      };

      const data_revenues = {
        labels: daysInSelectedIntervalArray,
        datasets: [
          {
            data: datasetRevenues,
            minBarLength: 3,
            borderColor: 'rgb(37, 99, 235)',
            backgroundColor: 'rgba(37, 99, 235, 0.5)',
          },
        ],
      };

      return (
        <Card>
          <span class="font-bold text-center mb-2">Daily Sales</span>
          <IntervalSection />

          <div class="text-md text-gray-900 font-bold text-center flex gap-2 justify-center flex-row">
            <CustomBarChart options={options_revenues} data={data_revenues} />
          </div>
        </Card>
      );
    }
  };

  const SalesRefundsRatio = () => {
    if (loading) {
      return (
        <Card>
          <div class="text-md text-gray-900 font-bold text-center flex gap-2 justify-center flex-row">
            Loading Profit/Loss <Spinner size="lg" />
          </div>
        </Card>
      );
    } else {
      const data = {
        labels: ['Sales', 'Refunds'],
        datasets: [
          {
            data: [12, 19],
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
            ],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(153, 102, 255, 1)'],
            borderWidth: 1,
          },
        ],
      };
      return (
        <Card>
          <div class="flex flex-col gap-2 text-md text-gray-900 items-center font-bold text-center flex gap-2 justify-center flex-row">
            <span class="font-bold text-center mb-2">Profit</span>
            <div class="w-96">
              <CustomPieChart data={data} />
            </div>
          </div>
        </Card>
      );
    }
  };

  const ProfitLossSection = () => {
    const data = {
      labels: ['Revenues', 'Costs'],
      datasets: [
        {
          data: [15, 4],
          minBarLength: 3,
          borderColor: ['rgba(1, 1, 1, 1)', 'rgba(1, 1, 1, 1)'],
          backgroundColor: ['rgba(97, 255, 6, 0.3)', 'rgba(255, 24, 6, 0.3)'],
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          position: 'top',
        },
        //   title: {
        //     display: true,
        //     text: 'Revenues',
        //   },
      },
      scales: {
        y: {
          ticks: {
            // Include a dollar sign in the ticks
            callback: function (value, index, ticks) {
              return '$' + value;
            },
          },
        },
      },
    };

    return (
      <Card>
        <span class=" font-bold text-center mb-2">Sales & Costs</span>

        <div class="flex flex-col gap-2 text-md text-gray-900 font-bold text-center flex gap-2 justify-center flex-row px-16">
          <CustomBarChart data={data} options={options} />
          <span class="font-normal">
            Profit <span class="font-bold">${cost}</span>
          </span>
        </div>
      </Card>
    );
  };

  return (
    <div class="flex flex-col mx-8 py-12">
      <span class="font-semibold text-3xl text-center">
        Sales / Profit / Loss
      </span>
      <span class="font text-l text-center">
        You can view detailed information about sales and profit/loss here.
      </span>

      {loading ? (
        <div class="flex flex-row justify-center items-center">Loading...</div>
      ) : (
        <div class="flex flex-col">
          <div class="m-20 grid grid-cols-4 gap-5">
            <div class="gap-5 flex-col flex col-span-2">
              <SalesSection />
              <SalesRefundsRatio />
            </div>
            <div class="col-span-2 flex-col flex">
              <ProfitLossSection />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;

import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { HiCalendar } from 'react-icons/hi';

import { Button } from 'flowbite-react';

const ExampleCustomInput = forwardRef(({ value, onClick, label }, ref) => (
  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-row gap-1">
      <label class="font-semibold text-sm text-gray-700">{label}</label>
    </div>
    <Button outline={true} gradientDuoTone="purpleToPink" onClick={onClick}>
      {value || (
        <div class="flex flex-row gap-1 items-center justify-center">
          <HiCalendar />
          Select
        </div>
      )}
    </Button>
  </div>
));

export const IntervalPicker = (props) => {
  const { startDate, setStartDate, endDate, setEndDate } = props;

  return (
    <div class="flex flex-row justify-center">
      <div class="flex flex-row gap-2 items-center">
        <div class="flex flex-row justify-center items-center gap-3">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            customInput={<ExampleCustomInput label={'From'} />}
            filterDate={(date) => {
              return new Date() > date;
            }}
            dateFormat="dd/MM/yyyy"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            customInput={<ExampleCustomInput label={'To'} />}
            filterDate={(date) => {
              const today = new Date();
              return today > date && startDate <= date;
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
      </div>
    </div>
  );
};

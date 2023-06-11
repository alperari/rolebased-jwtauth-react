import {
  Button,
  TextInput,
  Label,
  Checkbox,
  Card,
  Alert,
  Dropdown,
  Avatar,
} from 'flowbite-react';

import { FaMoneyBillWave } from 'react-icons/fa';

export const UserCard = ({ user }) => {
  return (
    <div className="container max-w-xl">
      <Card>
        <div className="flex justify-end px-4 pt-4">
          <Dropdown inline={true} label="">
            <Dropdown.Item>
              <a
                href="#"
                className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Edit
              </a>
            </Dropdown.Item>
          </Dropdown>
        </div>
        <div className="flex flex-col items-center pb-10">
          <Avatar size="xl" />
          <h5 className="mb-1 mt-3 text-xl font-medium text-gray-900 dark:text-white">
            {user.name + ' '}
            <>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({user.username})
              </span>
            </>
          </h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </span>

          <hr class="w-full h-1 mx-auto my-2 bg-gray-100 border-0 rounded md:my-5 dark:bg-gray-700" />

          <div className="mt-4 flex flex-col space-y-4 lg:mt-6 text-center">
            <div>
              <h5 className="text-m pt-4 font-medium text-gray-900 dark:text-white">
                Tax ID
              </h5>
              <div class="flex flex-col py-2 px-4 rounded-3xl bg-gray-100 items-center justify-center">
                {user.tax_id}
              </div>
            </div>

            <div>
              <h5 className="text-m pt-4 font-medium text-gray-900 dark:text-white">
                Address
              </h5>
              <div class="flex flex-col py-2 px-4 rounded-3xl bg-gray-100 items-center justify-center">
                {user.address}
              </div>
            </div>

            <div>
              <h5 className="text-m pt-4 font-medium text-gray-900 dark:text-white">
                Account Balance
              </h5>
              <div class="flex flex-col p-2 rounded-3xl bg-green-100 items-center justify-center">
                <div class="flex flex-row gap-2 items-center justify-center text-green-900 font-bold">
                  <FaMoneyBillWave size={20} />
                  {user.balance.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

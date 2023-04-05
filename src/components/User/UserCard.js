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

const user = JSON.parse(localStorage.getItem('user'));

export const UserCard = () => {
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

          <div className="mt-4 flex flex-col space-y-1 lg:mt-6 text-center">
            <h5 className="mb-1 text-m font-medium text-gray-900 dark:text-white">
              Address
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {user.address}
            </span>

            <h5 className="pt-4 text-m font-medium text-gray-900 dark:text-white">
              Account Balance
            </h5>
            <span className="text-sm text-blue-500 dark:text-gray-400">
              $ {user.balance}
            </span>

            <h5 className="pt-4 text-m font-medium text-gray-900 dark:text-white">
              Role
            </h5>
            <h6 className=" text-sm font-small text-red-500 text-dark:text-white">
              {user.role}
            </h6>
          </div>
        </div>
      </Card>
    </div>
  );
};

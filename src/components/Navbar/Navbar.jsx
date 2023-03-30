import React from 'react';
import {Link} from 'react-router-dom';
import { Dropdown } from 'flowbite-react';
import { Button } from 'flowbite-react';

const Navbar = () => { return (
    <nav class="bg-black border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900">
      <div class="container flex">
        <div class="text-pink-500">
            Logo
        </div>

        <div class="container flex justify-center space-x-4 mx-auto items-center">
            <div class="text-white hover:text-pink-500">
                <Link to="/">Home</Link>
            </div>
            <div class="text-white hover:text-pink-500">
                <Link to="/products/1">Protein</Link>
            </div>
            <div class="text-white hover:text-pink-500">
                <Link to="/products/2">Creatine</Link>
            </div>

        </div>
        
        <Dropdown class = "button text-pink-500"
        label="User"
        dismissOnClick={false}
        >
        <Dropdown.Item>
            Dashboard
        </Dropdown.Item>
        <Dropdown.Item>
            Settings
        </Dropdown.Item>
        <Dropdown.Item>
            Earnings
        </Dropdown.Item>
        <Dropdown.Item>
            Sign out
        </Dropdown.Item>
        </Dropdown>
        

      </div>
      
    </nav>
    );
}






export default Navbar
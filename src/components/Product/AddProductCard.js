import React, { useState, useEffect } from 'react';

import {
  Button,
  TextInput,
  Label,
  FileInput,
  Textarea,
  Checkbox,
  Card,
  Alert,
  Dropdown,
  ToggleSwitch,
  Select,
} from 'flowbite-react';

import { useNavigate } from 'react-router-dom';

import { ProductService } from '../../services/ProductService';
import { CustomModal } from '../General/Modal';
import { IoCompassOutline } from 'react-icons/io5';

export const AddProductCard = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState(null);

  // Modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const onCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const onImageSelect = (e) => {
    setImage(e.target.files[0]);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const name = e.target.name.value;
    const description = e.target.description.value;
    const category =
      selectedCategory === 'Add New Category'
        ? e.target.specifyCategory.value
        : selectedCategory;

    const distributor = e.target.distributor.value;

    const product = await ProductService.addProduct({
      name,
      description,
      image,
      category,
      distributor,
    });

    setLoading(false);

    // If create product is successful, show "success modal"
    if (!product.error) {
      setShowSuccessModal(true);
    } else {
      // Else, show "error modal"
      setShowErrorModal(true);
    }
  };

  const getCategories = async () => {
    const fetchedCategories = await ProductService.getCategories();

    setCategories([...fetchedCategories, 'Add New Category']);

    if (fetchedCategories.length === 0) {
      setSelectedCategory('Add New Category');
    } else {
      setSelectedCategory(fetchedCategories[0]);
    }
  };

  // Fetch categories from API before the render
  useEffect(() => {
    getCategories();
  }, [loading, showSuccessModal, showErrorModal]);

  return (
    <div className="container max-w-xl">
      {showSuccessModal && (
        <CustomModal
          title="✅ Product Creation Is Successful ✅"
          message1="Your product has been added successfully."
          message2="You can now view it in the products page."
          show={showSuccessModal}
          setShow={setShowSuccessModal}
        />
      )}
      {showErrorModal && (
        <CustomModal
          title="❌ Product Creation Failed! ❌"
          message1="Failed to create your product."
          message2="Please try again later with different parameters."
          show={showErrorModal}
          setShow={setShowErrorModal}
        />
      )}
      {loading && (
        <CustomModal
          title="⌛ Processing... ⌛"
          message1="Listing your product."
          message2="This might take some time."
          show={loading}
          setShow={setLoading}
          dismisable={false}
        />
      )}
      <Card>
        <form class="flex flex-col space-y-5" onSubmit={onFormSubmit}>
          <div id="image">
            <div className="block">
              <Label htmlFor="image" value="Upload Image" />
            </div>
            <FileInput
              id="image"
              helperText="An image of your product would be nice."
              required={true}
              onChange={onImageSelect}
            />
          </div>

          <div className="block">
            <Label htmlFor="name" value="Name" />
            <TextInput
              id="name"
              type="text"
              placeholder="Whey Protein 2000gr - Chocolate Flavour"
              required={true}
              helperText="Add a name for your product"
            />
          </div>

          <div id="textarea">
            <div className="block">
              <Label htmlFor="description" value="Description" />
              <Textarea
                id="description"
                placeholder="Tasty and delicious..."
                required={true}
                rows={4}
              />
            </div>
          </div>

          <div id="select">
            <div className="block">
              <Label htmlFor="countries" value="Select Category" />
            </div>
            <Select id="countries" required={true} onChange={onCategoryChange}>
              {categories &&
                categories.map((category, index) => {
                  return <option key={index}>{category}</option>;
                })}
            </Select>
          </div>

          {selectedCategory === 'Add New Category' && (
            <div>
              <Label
                class="text-blue-500 text-sm font-bold"
                htmlFor="specifyCategory"
              >
                Specify Category
              </Label>
              <TextInput
                type="text"
                id="specifyCategory"
                placeholder="Creatine"
                required={true}
              />
            </div>
          )}

          <div>
            <Label htmlFor="distributor">Distributor</Label>
            <TextInput
              type="text"
              id="distributor"
              placeholder="Hardline Nutrition"
              required={true}
            />
          </div>

          <div>
            <Label htmlFor="disabledInput1">
              Quantity{' '}
              <>
                <span className="text-sm text-gray-300 dark:text-gray-400">
                  (To be determined later)
                </span>
              </>
            </Label>
            <TextInput
              type="number"
              id="quantity"
              placeholder="0"
              disabled={true}
              // required={true}
            />
          </div>

          <div>
            <Label htmlFor="disabledInput1">
              Price{' '}
              <>
                <span className="text-sm text-gray-300 dark:text-gray-400">
                  (To be determined by sales manager)
                </span>
              </>
            </Label>
            <TextInput
              type="text"
              id="disabledInput1"
              placeholder="$ 0.00"
              disabled={true}
            />
          </div>

          <div>
            <Label htmlFor="disabledInput1">
              Discount{' '}
              <>
                <span className="text-sm text-gray-300 dark:text-gray-400">
                  (To be determined by sales manager)
                </span>
              </>
            </Label>
            <TextInput
              type="text"
              id="disabledInput1"
              placeholder="- 0.00 %"
              disabled={true}
            />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </Card>
    </div>
  );
};

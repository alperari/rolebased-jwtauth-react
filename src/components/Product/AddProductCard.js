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

import { ProductService } from '../../services/ProductService';

export const AddProductCard = () => {
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState(['Other']);

  const onCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const onSelectImage = (e) => {
    setImage(e.target.files[0]);
  };

  const getCategories = async () => {
    const fetchedCategories = await ProductService.getCategories();

    setCategories([...categories, ...fetchedCategories]);
  };

  const addProduct = async () => {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;

    const product = await ProductService.addProduct({
      name,
      description,
      image,
      category,
    });
  };

  // Fetch categories from API before the render
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="container max-w-xl">
      <Card>
        <div class="flex flex-col space-y-5">
          <div id="image">
            <div className="block">
              <Label htmlFor="image" value="Upload Image" />
            </div>
            <FileInput
              id="image"
              helperText="An image of your product would be nice."
              required={true}
              onChange={onSelectImage}
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
                  return <option>{category}</option>;
                })}
            </Select>
          </div>

          {category === 'Other' && (
            <div>
              <Label htmlFor="otherCategory">Specify Category</Label>
              <TextInput
                type="text"
                id="otherCategory"
                placeholder="Creatine"
                required={true}
              />
            </div>
          )}

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <TextInput
              type="number"
              id="quantity"
              placeholder="0"
              required={true}
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
        </div>
      </Card>
    </div>
  );
};

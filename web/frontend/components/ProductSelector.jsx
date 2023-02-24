import {useState, useCallback, useRef} from 'react';
import { useAuthenticatedFetch } from "../hooks";
import {
  Select
} from "@shopify/polaris";

export async function ProductSelector() {
  const fetch = useAuthenticatedFetch();

  const [selected, setSelected] = useState('today');

  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const options = [
    {label: 'Today', value: 'today'},
    {label: 'Yesterday', value: 'yesterday'},
    {label: 'Last 7 days', value: 'lastWeek'},
  ];
  

  const getOptions = async () => {
    try {
      const response = await fetch('/api/2023-01/products.json');
      const products = await response.json();
      let options = [];

      console.log(products);
      products.forEach((product) => {
        const option = {
            label: product.title
        }

        options.push(option);
      })

      return options;

    } catch(err) {
      console.log(err);
    }
  }
  console.log('GET OPTIONS:')
  options = await getOptions();
  

  return (
    <Select
      label="Products"  
      options={options}
      onChange={handleSelectChange}
      value={selected}
    />
  );
}

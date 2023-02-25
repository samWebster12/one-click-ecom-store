import { useState, useCallback } from "react";
import {
  Card,
  Heading,
  TextContainer,
  DisplayText,
  TextStyle,
  Select,
  TextField
} from "@shopify/polaris";
import { Toast } from "@shopify/app-bridge-react";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductSelector() {
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState();
  const [options, setOptions] = useState([]);
  const handleSelectChange = useCallback((value) => setSelected(value), []);

  const fetch = useAuthenticatedFetch();

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/2023-01/products.json",
    reactQueryOptions: {
      onSuccess: (newData) => {
        setIsLoading(false);
        let options = [];
        newData.forEach((product) => {
          const option = {
              label: product.title,
              value: product.title,
              description: product.body_html
          }
          options.push(option);
        });

        setOptions(options);
        
      },
    },
  });

  return (
    <Select
      label="Products"
      options={options}
      onChange={handleSelectChange}
      value={selected}
    />
  );

}

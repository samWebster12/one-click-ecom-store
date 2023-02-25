import {TextField} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductTextField(props) {
  const fetch = useAuthenticatedFetch();

  const [description, setDescription] = useState()
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState();

  const handleChange = useCallback((newValue) => setValue(newValue), []);

  const {
    data,
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/2022-07/products/" + props.productId + ".json",
    reactQueryOptions: {
      onSuccess: (newData) => {
        console.log(newData);
        setIsLoading(false);
        setDescription(newData.body_html)
        setValue(description);
        
      },
    },
  });

  return (
    <TextField
      label="Description"
      value={value}
      onChange={handleChange}
      autoComplete="off"
    />
  );
}
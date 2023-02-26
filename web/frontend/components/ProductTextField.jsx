import {TextField} from '@shopify/polaris';
import {useState, useCallback, useEffect, useRef} from 'react';
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductTextField(props) {
  const fetch = useAuthenticatedFetch();

  const description = useRef()
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState('');

  const handleChange = useCallback((newValue) => setValue(newValue), []);

  useEffect(() => {
    console.log('TESTING')
    console.log('props.option')
    console.log(props.option)
    description.current = props.option ? props.option.label : ''
    console.log(props.option)
    //description.current = 'test' + props.option.label
  });
 // setValue(props.option.description);

 /* const {
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
        console.log('OPTION: ')
        console.log(props.option);
        setDescription(newData.body_html)
        setValue(description);
        
      },
    },
  });*/

  return (
    <TextField
      label="Description"
      value={description.current}
      onChange={handleChange}
      autoComplete="off"
    />
  );
}
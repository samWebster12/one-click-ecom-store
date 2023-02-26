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

export function ProductSelector(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState();

  const handleSelectChange = useCallback((value) => { 
    setSelected(value); 
    let option = {};
    props.options.forEach((opt) => {
      if (value == opt.label) {
        option = opt;
      }
    })  
    console.log('OPTION: ');
    console.log(option)
    props.setSelectedOption(option)
  }, []);


  return (
    <Select
      label="Products"
      options={props.options}
      onChange={handleSelectChange}
      value={selected}
    />
  );

}

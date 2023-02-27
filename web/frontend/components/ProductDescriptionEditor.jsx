import {
    Card,
    Page,
    Layout,
    TextContainer,
    Image,
    Stack,
    Select,
    Link,
    Heading,
    Modal,
    TextField,
    Button
  } from "@shopify/polaris";

  
  
  import { TitleBar } from "@shopify/app-bridge-react";
  
  import {useState, useCallback, useRef} from 'react';

  import { useAuthenticatedFetch, useAppQuery } from "../hooks";
  
  import { trophyImage } from "../assets";
  
  import { Toast } from "@shopify/app-bridge-react";
  
  export function ProductDescriptionEditor() {
    const fetch = useAuthenticatedFetch();
    const emptyToastProps = { content: null };

    const [toastProps, setToastProps] = useState(emptyToastProps);
    const [selectedOption, setSelectedOption] = useState();
    

    //SELECT 
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState();

    const handleSelectChange = useCallback((value) => { 
        setSelected(value); 
        let option = {};
        options.forEach((opt) => {
          if (value == opt.label) {
            option = opt;
          }
        })  
        setSelectedOption(option);
        setTextFieldValue(option.description)
      }, []);

    //TEXT FIELD
    const [textFieldValue, setTextFieldValue] = useState();
    const handleTextChange = useCallback((newValue) => setTextFieldValue(newValue), []);

    //BUTTON
    const handleButtonClick = useCallback(async () => {
        console.log('sending to chatgpt');
        try {
          const response = await fetch('/api/chatgpt', {
            method: 'POST',
            body: JSON.stringify({message: 'what is your name?' })
            
          });
          const chatgpt = await response.json();
          console.log(chatgpt.response);
        } catch (e) {
          console.log(e);
        }
        const response = await fetch('/chatgpt');
        

    /*    const data = {
            id: selectedOption.id,
            body_html: textFieldValue
        }

        try {
            const response = await fetch('/api/2023-01/products/' + selectedOption.id + '.json', { 
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setToastProps({ content: "Description succesfully updated!" });
            } else {
                setToastProps({
                    content: "There was an error updating the description",
                    error: true,
                  });
            }


        } catch(err) {
            console.log(err);
        }*/

        
    })


    //INITIAL FETCH

    const {
        data,
        refetch: refetchProductCount,
        isLoading: isLoadingCount,
        isRefetching: isRefetchingCount,
      } = useAppQuery({
        url: "/api/2023-01/products.json",
        reactQueryOptions: {
          onSuccess: (newData) => {
            let retrievedOptions = [];
            newData.forEach((product) => {
              const option = {
                  label: product.title,
                  value: product.title,
                  description: product.body_html,
                  id: product.id
              }
              retrievedOptions.push(option);
            });

            setOptions(retrievedOptions);

            setSelectedOption(retrievedOptions[0]);
            setTextFieldValue(retrievedOptions[0].description)
            
          },
        },
      });

    //TOAST
    const toastMarkup = toastProps.content && !isRefetchingCount && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
      );

    return (
        <>
          {toastMarkup}
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="left"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                <Select label="Products" options={options} onChange={handleSelectChange} value={selected}></Select>
                <TextField label="description" value={textFieldValue} onChange={handleTextChange} autoComplete="off"></TextField>


                    <Button onClick={handleButtonClick} primary={true}>Update Description</Button>
                </TextContainer>
            
              </Stack.Item>

              <Stack.Item>
                <div style={{ padding: "0 20px" }}>
                  <Image
                    source={trophyImage}
                    alt="Nice work on building a Shopify app"
                    width={120}
                  />
                </div>
              </Stack.Item>
              
            </Stack>
          </Card>
        </>
    );
  }
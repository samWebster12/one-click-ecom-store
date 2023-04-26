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
    Button,
    ButtonGroup,
    ResourceList,
    ResourceItem,
    Spinner
  } from "@shopify/polaris";

  
  
  import { TitleBar } from "@shopify/app-bridge-react";
  
  import {useCallback, useRef, useState, useEffect} from 'react';

  import { useAuthenticatedFetch, useAppQuery } from "../hooks";
  
  import { trophyImage } from "../assets";
  
  import { Toast } from "@shopify/app-bridge-react";

  import { KeywordCard } from "../components/KeywordCard";
  
  export function ProductDescriptionEditor() {
    const fetch = useAuthenticatedFetch();
    const emptyToastProps = { content: null };

    const [toastProps, setToastProps] = useState(emptyToastProps);
    const [selectedOption, setSelectedOption] = useState();

    const [isLoading, setIsLoading] = useState(true);

    //SELECT
    const [options, setOptions] = useState();
    const [selected, setSelected] = useState();

    //INITIAL FETCH

    const {
        data,
        refetch: refetchProductCount,
        isLoading: isLoadingCount,
        isRefetching: isRefetchingCount,
      } = useAppQuery({
        url: "/api/backend/2023-01/products.json",
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
            setDescriptionFieldValue(retrievedOptions[0].description);

            setIsLoading(false);
            
          },
        },
      });
    

    //SELECT 

    const handleSelectChange = (value) => { 
        setSelected(value); 
        let option = {};
        options.forEach((opt) => {
          if (value == opt.label) {
            option = opt;
          }
        })  
        setSelectedOption(option);
        setDescriptionFieldValue(option.description)
      };

    //KEYWORD FIELD
    const [keywordFieldValue, setKeywordFieldValue] = useState('');
    const handleKeywordFieldChange = useCallback((newValue) => setKeywordFieldValue(newValue), []);

    //KEYWORDS
    const [keywords, setKeywords] = useState([]);

    //DESCRIPTION FIELD
    const [descriptionFieldValue, setDescriptionFieldValue] = useState();
    const handleDescriptionFieldChange = useCallback((newValue) => setDescriptionFieldValue(newValue), []);


    //ADD KEYWORD BUTTON
    const handleAddKeyword = useCallback(() => {
      setKeywords([...keywords, keywordFieldValue])
    })

    //DELETE KEYWORD BUTTON
    const handleDeleteKeyword = useCallback((keywordToDelete) => {
        setKeywords(keywords.filter(keyword => keyword !== keywordToDelete))
    })

    //NEW DESCRIPTION BUTTON
    const handleNewDescription = useCallback(async () => {
        console.log('sending to chatgpt');
        let message = 'Generate a product description for a product called ' + selectedOption.label;
        if (keywords.length > 0) {
            message += ' with the following keywords: '
        }

        for (let i = 0; i < keywords.length-1; i++) {
            message += keywords[i] + ', '
        }

        message += keywords[keywords.length-1];
        console.log(message);

        try {
          const response = await fetch('/api/backend/chatgpt', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message })
            
          });
          const chatgpt = await response.json();
          console.log(chatgpt.response)
          setDescriptionFieldValue(chatgpt.response);
        } catch (e) {
          console.log(e);
        }
        
    })

    //UPDATE DESCRIPTION BUTTON
    const handleUpdateDescription = useCallback(async () => {

        const data = {
            id: selectedOption.id,
            body_html: descriptionFieldValue
        }

        try {
            const response = await fetch('/api/backend/2023-01/products/' + selectedOption.id + '.json', { 
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
        }

        
    })



    //TOAST
    const toastMarkup = toastProps.content && !isRefetchingCount && (
        <Toast {...toastProps} onDismiss={() => setToastProps(emptyToastProps)} />
      );

    //MARKUP
    return (
        <>
          {toastMarkup}
          { !isLoading ? <Card 
            sectioned
            loading={isLoading}
            >
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="left"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                <Select label="Products" options={options} onChange={handleSelectChange} value={selected}></Select>
                <Stack
                    wrap={false}
                    spacing="extraTight"
                    distribution="trailing"
                    alignment="trailing"
                >
                    <Stack.Item fill>
                        <TextField label="Add Keywords" value={keywordFieldValue} onChange={handleKeywordFieldChange} autoComplete="off"></TextField>
                    </Stack.Item>
                    <Stack.Item>
                        <Button onClick={handleAddKeyword} primary={true}>Add Keyword</Button>

                    </Stack.Item>
                </Stack>
                <ResourceList
                    items={keywords}
                    renderItem={(keyword) => {
                        return (
                            <ResourceItem
  
                            >
                                <Stack
                                    wrap={false}
                                    spacing="loose"
                                    distribution="trailing"
                                    alignment="center"
                                >
                                    <Stack.Item fill>
                                        <KeywordCard keyword={keyword}/>
                                    </Stack.Item>
                                    <Stack.Item>
                                        <Button onClick={handleDeleteKeyword.bind(this, keyword)} destructive={true}>Delete</Button>
                                    </Stack.Item>
                                </Stack>
                            </ResourceItem>
                            
                        );
                    }}
                />
                
                <TextField label="Description" value={descriptionFieldValue} onChange={handleDescriptionFieldChange} autoComplete="off"></TextField>
                
                <ButtonGroup>
                    <Button onClick={handleUpdateDescription} primary={true}>Update Description</Button>
                    <Button onClick={handleNewDescription}>Generate New Description</Button>
                </ButtonGroup>
                </TextContainer>
            
              </Stack.Item>

              
              
            </Stack>
          </Card> : <Stack alignment="center" distribution="center"><Stack.Item fill><Spinner accessibilityLabel="Spinner example" size="large" /></Stack.Item></Stack> }
        </>
    );
  }
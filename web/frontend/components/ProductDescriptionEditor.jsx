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
    Button,
    Modal,
    TextField
  } from "@shopify/polaris";
  
  import { TitleBar } from "@shopify/app-bridge-react";
  
  import {useState, useCallback, useRef} from 'react';
  
  import { useAuthenticatedFetch, useAppQuery } from "../hooks";
  
  import { trophyImage } from "../assets";
  
  import { ProductSelector } from '../components/ProductSelector';
  import { ProductsCard } from '../components/ProductsCard';
  import { ProductTest } from '../components/ProductTest';
  import { ProductTextField } from '../components/ProductTextField';
  
  export function ProductDescriptionEditor() {
    const fetch = useAuthenticatedFetch();

    const [selectedOption, setSelectedOption] = useState();

    //SELECT 
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState();

    //TEXT FIELD
    const [textFieldValue, setTextFieldValue] = useState();
    const handleTextChange = useCallback((newValue) => setTextFieldValue(newValue), []);

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

    const {
        data,
        refetch: refetchProductCount,
        isLoading: isLoadingCount,
        isRefetching: isRefetchingCount,
      } = useAppQuery({
        url: "/api/2023-01/products.json",
        reactQueryOptions: {
          onSuccess: (newData) => {
            let options = [];
            newData.forEach((product) => {
              const option = {
                  label: product.title,
                  value: product.title,
                  description: product.body_html,
                  id: product.id
              }
              options.push(option);
            });
    
            setOptions(options);
            console.log('setting selected option'); console.log(options[0])
            setSelectedOption(options[0]);
            setTextFieldValue(options[0].description)
            
          },
        },
      });

  
    return (
      
      <Page narrowWidth>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="left"
            >
              <Stack.Item fill>
                <Select options={options} onChange={handleSelectChange} value={selected}></Select>
                <TextField label="description" value={textFieldValue} onChange={handleTextChange} autoComplete="off"></TextField>
            
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
        </Layout.Section>
      </Page>
    );
  }
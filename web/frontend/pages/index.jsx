import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
  Button,
  Modal
} from "@shopify/polaris";

import { TitleBar } from "@shopify/app-bridge-react";

import {useState, useCallback, useRef} from 'react';

import { useAuthenticatedFetch } from "../hooks";

import { trophyImage } from "../assets";

import { ProductSelector } from '../components/ProductSelector';
import { ProductsCard } from '../components/ProductsCard';
import { ProductTest } from '../components/ProductTest';
import { ProductTextField } from '../components/ProductTextField';
import { ProductDescriptionEditor } from '../components/ProductDescriptionEditor'

export default function HomePage() {
  const fetch = useAuthenticatedFetch();
  
  const [active, setActive] = useState(true);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const modal_activator = useRef();

  return (
    
    <Page narrowWidth>
      <ProductDescriptionEditor></ProductDescriptionEditor>
      <TitleBar title="One Click Ecom Store" primaryAction={null} />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Heading> Welcome to One Click Ecom Store! </Heading>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor delectus doloremque blanditiis, ipsa sunt cupiditate consequuntur, quia impedit magni facere expedita sit illum distinctio soluta aliquid reprehenderit iste repellat maxime?
                  </p>
                  <p>
                    Ready to go? Start populating your app with some sample
                    products to view and test in your store.{" "}
                  </p>
                  <Button ref={modal_activator} onClick={handleChange}>Generate New Website</Button>
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
        </Layout.Section>

      <Modal
        activator={modal_activator}
        open={!active}
        onClose={handleChange}
        title="Lets Create Your Product Descriptions"
        primaryAction={{
          content: 'Generate New Product Descriptions',
          onAction: () => {} ,
        }}

      >
        <Modal.Section>
          <TextContainer>
            <p>
              To get started, lets generate some new products
              descriptions for you. We will use chatgpt and take
              your products and generate engaging copy for them
            </p>
          </TextContainer>
        </Modal.Section>
      </Modal>

      </Layout>
    </Page>
  );
}


// TEST FUNCTIONS
/*
const getProducts = async () => {
    try {
      const response = await fetch('/api/2023-01/products.json');
      console.log(await response.json());

    } catch(err) {
      console.log(err);
    }
  }

  //getProducts();

  const updateProduct = async () => {
    try {
      const response = await fetch('/api/2023-01/products/8129604321555.json', { method: 'PUT' });
      console.log(response);
    } catch(err) {
      console.log(err);
    }
  }


  const genNewProductDescriptions = async () => {
    try {
      const response = await fetch('/api/2023-01/products.json');
      const products = await response.json();


      products.forEach(async (product) => {
        console.log('product 1: ');
        console.log(product);

        //Generate New Description
        const description = 'test description';

        const url = '/api/2023-01/products/' + product.id + '.json'

        console.log('test')
        const response = await fetch(url, { method: 'PUT' })

        console.log(response);

      })

    } catch(err) {
      console.log(err);
    }

  }
*/

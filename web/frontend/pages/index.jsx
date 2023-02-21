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
import axios from 'axios';


import { trophyImage } from "../assets";

import { ProductsCard } from "../components";

export default function HomePage() {
  const [active, setActive] = useState(true);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const fetchCollection = async () => {
    try {
      const response = await fetch('/api/collections/435547210003');
      console.log(await response.json());
    } catch(err) {

      console.log(err);
    }
  }

  fetchCollection();

  const getProductCount = async () => {
    try {
      const response = await axios.get('/api/products/count');
      console.log(await response.json());

    } catch(err) {

      console.log(err);
    }
  }

  const getProducts = async () => {
    try {
      const response = await axios.get('/api/2023-01/products.json');
      console.log(await response.json());

    } catch(err) {
      console.log(err);
    }
  }


  const genNewProductDescriptions = async () => {
    /*const products = await shopify.rest.Product.all({
      session: session,
    });*/

    console.log(products)
  }

  const modal_activator = useRef();

  return (
    <Page narrowWidth>
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
          onAction: getProductCount,
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

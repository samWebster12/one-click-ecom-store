// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import { ChatGPTAPI } from 'chatgpt'
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import { Shopify } from '@shopify/shopify-api';
import cors from 'cors';

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.use(cors())

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session


app.use("/api/backend/*", shopify.validateAuthenticatedSession()); //DELETE FOR APP PROXY, KEEP FOR EVERYTHING ELSE
app.use("/api/proxyroute/*", async (req, res) =>  {
  const session = await Shopify.Utils.loadOfflineSession('our-test-store-569.myshopify.com');
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);

  const shop = await client.query({
    data: `{
      shop {
        name
      }
    }`
  })
})

app.use(express.json());

app.get('/api/proxyroute/proxy', (req, res) => { 
  res.status(200).end('this is my test');
})

//------------------------------ MY ENDPOINTS ---------------------------------------------------------------
const OPENAI_API_KEY='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' //temporary
app.post('/api/backend/chatgpt', async (req, res) => {
  try {
    const api = new ChatGPTAPI({
      apiKey: OPENAI_API_KEY
    })
    const response = await api.sendMessage(req.body.message);
  //  console.log(response);
    res.status(200).json({ response: response.text});
  } catch (e) {
    console.log(e);
  }

})

app.get('/api/backend/test', async (req, res) =>{
  res.status(200).send('this is my test');
})

//------------------------------ MY SHOPIFY ENDPOINTS -------------------------------------------------------

//Get all products
app.get('/api/backend/2023-01/products.json', async (req, res) => {
  console.log('pRODUCTS JSON: ' + res.locals.shopify.session)
  try {
    const response = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session
    });
    console.log('sent PRODUCTS JSON')
    res.status(200).send(response);

  } catch(err) {

    res.status(500).send(err);
  }
});

//Get a single product 
app.get('/api/backend/2022-07/products/:productId', async (req, res) => {

  try {
    const productId = Number(req.params.productId.split('.')[0]);

    const response = await shopify.api.rest.Product.find({
      session: res.locals.shopify.session,
      id: productId,
    });

    res.status(200).send(response);

  } catch(err) {

    res.status(500).send(err);
  }
});

//Update Single Product
app.put('/api/backend/2023-01/products/:productId', async (req, res) => {
 // console.log('id: ' + req.body.id + '\t\tdescription: ' + req.body.description)
  try {
    const product = new shopify.api.rest.Product({session: res.locals.shopify.session});
    product.id = req.body.id; //Number(productId)
    product.body_html = req.body.body_html;

    const response = await product.save({
      update: true,
    });

    res.status(200).send(response);

  } catch(err) {

    res.status(500).send(err);
  }
})


app.get('/api/backend/2023-01/themes/144745857299/assets.json', async (req, res) => {
  try {
    const letssee = await shopify.api.rest.Asset.all({
      session: res.locals.shopify.session,
      theme_id: 144745857299,
    //  asset: {"key": "layout/password.liquid"},
    });
    let i = 0;
    for (i = 0; i < letssee.length; i++) {
      console.log(letssee[i].content_type)
      if (letssee[i].content_type == 'application/x-liquid') {
        console.log(letssee[i])
      }
    }

    //console.log(letssee[i]);
    //console.log(letssee);


  } catch(e) {
    console.log('ERROR!');
    console.log(e);
  }
  
});


//---------------------------------------------------------------------------------------------

app.get("/api/backend/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
//  res.status(200).end('countdata');
});

app.get("/api/backend/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);


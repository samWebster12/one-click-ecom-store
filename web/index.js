// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

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

// Validate Session Id Manually Since the Default doesn't work
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

//------------------------------ MY ENDPOINTS ---------------------------------------------------------------

app.get('/api/2023-01/products.json', async (req, res) => {
  try {
    const response = await shopify.api.rest.Product.all({
      session: res.locals.shopify.session
    });

    res.status(200).send(response);

  } catch(err) {

    res.status(500).send(err);
  }
});

app.put('/api/2023-01/products/:productId', async (req, res) => {
 // console.log('id: ' + req.body.id + '\t\tdescription: ' + req.body.description)
  try {
    const productId = req.params.productId.split('.')[0];
    console.log('update product: ' + productId);
    const product = new shopify.api.rest.Product({session: res.locals.shopify.session});
    product.id = Number(productId);

    product.body_html = "Brand new description";


    const response = await product.save({
      update: true,
    });

    res.status(200).send(response);

  } catch(err) {

    res.status(500).send(err);
  }
})



//---------------------------------------------------------------------------------------------

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
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


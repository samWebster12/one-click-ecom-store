import shopify from "./shopify.js";

export const checkForSession = async function (req, res, next) {
    const session = await shopify.sessionStorage.collection('shopify_sessions').findOne({  /** whatever index **/ })
    res.locals.shopify = { session: {} }
    res.locals.shopify.session = session
    next()
}
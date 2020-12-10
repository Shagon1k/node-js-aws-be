import axios from 'axios';
import ServerError from '../lib/error';
import MemoryCache from '../lib/cache';

const productsCache = new MemoryCache(120000);
const CACHING_SUBURLS_REGEX = [/\/products$/];

const checkIfShouldBeCached = subUrl => CACHING_SUBURLS_REGEX.some(subUrlRegex => subUrlRegex.test(subUrl));

const getProductController = () => async (req, res, next) => {
  try {
    const baseUrl = process.env['route-product'];
    if (!baseUrl) {
      throw new ServerError('No base url configured!', 500);
    }
    res.locals.handled = true;

    let resp;
    const {
      originalUrl,
      method,
      body: data = null
    } = req;
    const additionalRequestParams = Object.keys(data) > 0 ? { data } : {};
    const subUrl = originalUrl.replace('/product', '');

    const axiosConfig = {
      method,
      url: `${baseUrl}${subUrl}`,
      // headers,
      ...additionalRequestParams,
    };

    if (checkIfShouldBeCached(subUrl)) {
      const cachedValue = productsCache.getValue(subUrl);

      if (cachedValue) {
        console.log('CACHED RETURNED');
        resp = cachedValue;
      } else {
        console.log('CACHED SAVED');
        resp = await axios(axiosConfig);
        productsCache.putValue(subUrl, resp);
      }
    } else {
      resp = await axios(axiosConfig);
    }

    res.set(resp.headers);
    res.json(resp.data);

    console.log('INFO: /product request was handled by BFF');

    return next();
  } catch (error) {
    console.log(error);

    return next(error);
  }
}

export default getProductController;

import axios from 'axios';
import ServerError from '../lib/error';
import filterAllowedHeaders from './helpers/expose-headers.helper';

const getCartController = () => async (req, res, next) => {
  try {
    const baseUrl = process.env['route-cart'];
    if (!baseUrl) {
      throw new ServerError('No base url configured!', 500);
    }
    res.locals.handled = true;

    const {
      headers = {},
      originalUrl,
      method,
      body: data = null
    } = req;
    const additionalRequestParams = Object.keys(data).length > 0 ? { data } : {};
    const subUrl = originalUrl.replace('/cart', '');

    const allowedHeaders = filterAllowedHeaders(headers);

    const axiosConfig = {
      method,
      url: `${baseUrl}${subUrl}`,
      headers: allowedHeaders,
      ...additionalRequestParams,
    };

    const resp = await axios(axiosConfig);

    res.set(resp.headers);
    res.json(resp.data);

    console.log('INFO: /cart request was handled by BFF');

    return next();
  } catch (error) {
    console.log(error);

    return next(error);
  }
}

export default getCartController;

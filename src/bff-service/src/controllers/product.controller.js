import axios from 'axios';
import ServerError from '../lib/error';

const getProductController = () => async (req, res, next) => {
  try {
    const baseUrl = process.env['route-product'];
    if (!baseUrl) {
      throw new ServerError('No base url configured!', 500);
    }
    res.locals.handled = true;

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

    const resp = await axios(axiosConfig);

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

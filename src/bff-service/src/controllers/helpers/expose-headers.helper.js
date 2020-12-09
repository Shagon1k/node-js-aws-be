const ALLOWED_HEADERS = ['authorization'];

const filterAllowedHeaders = (headersObj = {}) => {
	const filteredHeaders = Object.keys(headersObj).reduce((acc, headerKey) => {
    if (ALLOWED_HEADERS.includes(headerKey)) {
      acc[headerKey] = headersObj[headerKey];
    }
    return acc;
  }, {});

  return filteredHeaders;
};

export default filterAllowedHeaders;

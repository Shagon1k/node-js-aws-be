import { ALLOWED_REQUEST_ORIGINS } from "@config/config";

const getAccessOriginHeader = (requestOrigin) => {
  return ALLOWED_REQUEST_ORIGINS.indexOf(requestOrigin) > -1 ? requestOrigin : "";
};

export default getAccessOriginHeader;

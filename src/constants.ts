import * as dotenv from 'dotenv';

dotenv.config();

export const processEnv = {
  web_url: process.env.WEB_URL,
  wisper_url: process.env.WISPER_API_URL,
  wisper_api_key: process.env.WISPER_API_KEY,
  gift_plan_id: process.env.GIFT_DATA_ID,
  gift_volume: process.env.GIFT_DATA_VOLUME,
  gift_network: process.env.GIFT_DATA_NETWORK,
  jwt_secret: process.env.JWT_SECRET,
};

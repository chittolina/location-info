const axios = require("axios");
const client = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api",
  params: {
    key: process.env.GOOGLE_API_KEY,
  },
});

module.exports = client;

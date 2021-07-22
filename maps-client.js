const axios = require("axios");
const client = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api",
  validateStatus: () => true, // Do not throw on 4xx/5xx
  params: {
    key: "AIzaSyBNW9ny7Q9TS1iRLYWgrWo4CwAb3wmrEik",
  },
});

module.exports = client;

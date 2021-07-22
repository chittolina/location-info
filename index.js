const express = require("express");
const app = express();
const port = 3000;
const mapsClient = require("./maps-client");

const validateParams = (queryParams) => {
  const { street, city, state, country } = queryParams;

  if (!street || !city || !state || !country) {
    return false;
  }

  return true;
};

app.get("/location-info", async (req, res) => {
  if (!validateParams(req.query)) {
    return res.status(400).send({
      message:
        "Please provide all the following query parameters: street, city, state, country",
    });
  }

  const { street, city, state, country } = req.query;
  const address = `${street}, ${city}, ${state}, ${country}`;

  const geocodeResponse = await mapsClient.get(`/geocode/json`, {
    params: { address },
  });

  if (!geocodeResponse.data?.results?.[0]?.geometry?.location) {
    return res.status(500).send({
      message:
        "Something went wrong when calling geocode API. Please try again later or review your parameters.",
    });
  }

  const { lat, lng } = geocodeResponse.data.results[0].geometry.location;

  // Call both elevation & timezone APIs concurrently
  const responses = await Promise.allSettled([
    mapsClient.get(`/elevation/json`, {
      params: {
        locations: `${lat},${lng}`,
      },
    }),
    mapsClient.get(`/timezone/json`, {
      params: {
        location: `${lat},${lng}`,
        timestamp: Date.now() / 1000,
      },
    }),
  ]);

  const successfulResponses = responses
    .filter((response) => response.status === "fulfilled")
    .map((response) => response.value);

  const [elevationResponse, timezoneResponse] = successfulResponses;

  if (!elevationResponse.data?.results?.[0]?.elevation) {
    return res.status(500).send({
      message:
        "Something went wrong when calling elevation API. Please try again later or review your parameters.",
    });
  }

  const { elevation } = elevationResponse.data.results[0];

  if (!timezoneResponse.data?.rawOffset || !timezoneResponse.data?.timeZoneId) {
    return res.status(500).send({
      message:
        "Something went wrong when calling timezone API. Please try again later or review your parameters.",
    });
  }

  const {
    rawOffset,
    dstOffset,
    timeZoneId: timezoneID,
  } = timezoneResponse.data;

  // Calculate current tz offset taking daylight saving time into account
  const timezoneOffset = (rawOffset + dstOffset) / 3600;

  res.status(200).send({ lat, lng, elevation, timezoneID, timezoneOffset });
});

app.listen(port, () => {
  console.log(`Service listening at http://localhost:${port}`);
});

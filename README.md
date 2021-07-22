## Location info

Rest API that returns some useful data from a given location.

### Request example:

```
GET http://<BASE_URL>:<PORT>/location-info?street=Wall Street&city=New York&state=New York&country=US
```

### Response example:

```json
{
  "lat": 40.7060361,
  "lng": -74.0088256,
  "elevation": 13.48266792297363,
  "timezoneID": "America/New_York",
  "timezoneOffset": -4
}
```

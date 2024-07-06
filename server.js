import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; 
const ipinfoToken = process.env.IPINFOTOKEN;
const weatherApiKey = process.env.OPENWEATHER;

app.use(express.json());

app.get("/api/hello/", async (req, res) => {
  const visitorName = req.query.visitor_name;
  let clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (clientIp === "::1" || clientIp === "127.0.0.1") {
    clientIp = "8.8.8.8";
  }

  if (!visitorName) {
    return res
      .status(400)
      .send({ error: "visitor_name query parameter is required" });
  }

  let locationData;
  try {
    const ipInfo = await axios.get(
      `https://ipinfo.io/${clientIp}?token=${ipinfoToken}`
    );
    locationData = ipInfo.data;
    console.log("Location Data:", locationData);
  } catch (error) {
    console.error("Error fetching IP info:", error);
    return res.status(500).send({ error: "Could not retrieve IP data" });
  }

  const { city } = locationData;
  if (!city) {
    return res
      .status(500)
      .send({ error: "Could not determine city from IP data" });
  }

  let temperature = null;
  try {
    const weatherResponse = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
    );
    temperature = weatherResponse.data.main.temp;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return res.status(500).send({ error: "Could not retrieve weather data" });
  }

  const response = {
    client_ip: clientIp,
    location: `${city}`,
    greeting: `Hello, ${visitorName}!, the temperature is ${temperature}°C in ${city}`,
  };

  res.send(response);
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

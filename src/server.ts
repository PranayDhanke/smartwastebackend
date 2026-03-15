import app from "./app";
import { mongoConnect } from "./lib/db";
import { initSocket } from "./lib/socket";
import http from "http";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  const server = http.createServer(app);

  await mongoConnect();

  initSocket(server);

  // Root route
  app.get("/", (_req, res) => {
    res.json({ message: "Server is running" });
  });

  // Health check route (for Azure / monitoring)
  app.get("/health", (_req, res) => {
    res.status(200).json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: Date.now(),
    });
  });

  server.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};

startServer();
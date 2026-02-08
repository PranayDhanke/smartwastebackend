import app from "./app";
import { mongoConnect } from "./lib/db";
import { initSocket } from "./lib/socket";
import http from "http";

const PORT = 8080;

const startServer = async () => {
  const server = http.createServer(app);

  await mongoConnect();

  initSocket(server);

  app.get("/", (_req, res) => {
    res.json({ message: "Server is running" });
  });

  server.listen(PORT, "0.0.0.0" , () => {
    console.log(`Server is running on ${PORT}`);
  });
};

startServer();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let stockPrice = 100;
let priceHistory = [stockPrice];

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

setInterval(() => {
  const change = (Math.random() - 0.5) * 10;
  stockPrice = Math.max(stockPrice + change, 1);
  priceHistory.push(stockPrice);

  io.emit("updatePrice", { stockPrice, priceHistory });
}, 2000);

io.on("connection", (socket) => {
  console.log("novo cliente conectado !");

  socket.emit("updatePrice", { stockPrice, priceHistory });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

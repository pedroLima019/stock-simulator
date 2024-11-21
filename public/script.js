
const balanceEl = document.getElementById("balance");
const stockPriceEl = document.getElementById("stockPrice");
const stocksOwnedEl = document.getElementById("stocksOwned");


let balance = 1000;
let stockPrice = 100;
let stocksOwned = 0;
let priceHistory = [stockPrice];


const ctx = document.getElementById("stockChart").getContext("2d");
const stockChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: Array(priceHistory.length).fill(""),
    datasets: [
      {
        label: "Preço da Ação ($)",
        data: priceHistory,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.2,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: { display: false },
    },
  },
});


function updateUI() {
  balanceEl.textContent = balance.toFixed(2);
  stockPriceEl.textContent = stockPrice.toFixed(2);
  stocksOwnedEl.textContent = stocksOwned;
}

function updateChart() {
  stockChart.data.labels.push("");
  stockChart.data.datasets[0].data.push(stockPrice);
  stockChart.update();
}

function fluctuatePrice() {
  const change = (Math.random() - 0.5) * 10; // Variação entre -5 e +5
  stockPrice = Math.max(stockPrice + change, 1); // Preço mínimo de $1
  updateChart();
  updateUI();
}

document.getElementById("buyButton").addEventListener("click", () => {
  if (balance >= stockPrice) {
    balance -= stockPrice;
    stocksOwned++;
    updateUI();
  } else {
    alert("Saldo insuficiente!");
  }
});

document.getElementById("sellButton").addEventListener("click", () => {
  if (stocksOwned > 0) {
    balance += stockPrice;
    stocksOwned--;
    updateUI();
  } else {
    alert("Você não possui ações para vender!");
  }
});

setInterval(fluctuatePrice, 2000);

const socket = io();

socket.on("updatePrice", (data) => {
  const { stockPrice, priceHistory } = data;

  
  stockPriceEl.textContent = stockPrice.toFixed(2);


  stockChart.data.labels.push("");
  stockChart.data.datasets[0].data.push(stockPrice);
  stockChart.update();
});

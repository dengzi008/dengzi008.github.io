const calcBtn = document.getElementById("calcBtn");
const randomBtn = document.getElementById("randomBtn");
const shareBtn = document.getElementById("shareBtn");
const amountInput = document.getElementById("amount");
const currencySelect = document.getElementById("currency");
const resultsEl = document.getElementById("results");
const emptyEl = document.getElementById("empty");
const rateInfo = document.getElementById("rateInfo");

// 物品价格以 CNY 为基准，price 为单价
const items = [
  { name: "矿泉水", price: 2, icon: "🧴", desc: "解渴续命，健身后的一口神水。" },
  { name: "泡面", price: 3.5, icon: "🍜", desc: "加班深夜档，幸福来得很快。" },
  { name: "可乐", price: 4, icon: "🥤", desc: "快乐肥宅水，一口回魂。" },
  { name: "苹果", price: 5, icon: "🍎", desc: "每天一苹果，医生远离我。（也许）" },
  { name: "纸巾", price: 4, icon: "🧻", desc: "关键时刻的体面守护者。" },
  { name: "地铁票", price: 6, icon: "🚇", desc: "一站到家，拯救通勤灵魂。" },
  { name: "共享单车", price: 1.5, icon: "🚲", desc: "短途神器，顺便锻炼小腿。" },
  { name: "咖啡", price: 18, icon: "☕", desc: "续命水，工位灵魂燃料。" },
  { name: "电影票", price: 40, icon: "🎬", desc: "两小时的平行世界冒险。" },
  { name: "游戏皮肤", price: 45, icon: "🎮", desc: "视觉升级，战绩不保证。" },
  { name: "花", price: 25, icon: "🌹", desc: "浪漫速递，心情直接+10。" },
  { name: "手链", price: 120, icon: "📿", desc: "精致生活的小确幸点缀。" },
  { name: "空调电费1小时", price: 2.2, icon: "❄️", desc: "夏日续命，冬日取暖。" },
  { name: "一顿简餐", price: 28, icon: "🍱", desc: "填饱肚子，填不满 KPI。" },
  { name: "网盘会员1月", price: 20, icon: "☁️", desc: "云里有你，文件不迷路。" },
  { name: "种一棵树", price: 10, icon: "🌳", desc: "给地球一点爱，碳中和助攻。" },
  { name: "非洲一顿饭", price: 6, icon: "🍛", desc: "跨时空关怀，提醒珍惜食物。" },
  { name: "Spotify 一首歌", price: 2, icon: "🎵", desc: "循环播放的快乐成本。" },
  { name: "回收10个塑料瓶收益", price: 1, icon: "♻️", desc: "环保 + 赚小钱，双赢！" },
  { name: "老板眨眼的时间", price: 0.1, icon: "😉", desc: "财富流逝就像眨眼一样快。" },
  { name: "10年前的100元购买力", price: 200, icon: "⌛", desc: "通胀警示牌，别让钱睡觉。" },
  { name: "小岛一天租金（梗）", price: 500, icon: "🏝️", desc: "想想就好，做梦免费。" },
];

const fallbackRates = {
  CNY: 1,
  USD: 0.14,
  EUR: 0.13,
  JPY: 20,
  HKD: 1.1,
};

let rates = { ...fallbackRates };
let rateStatus = "本地汇率（可能略旧）";

async function fetchRates() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/CNY");
    if (!res.ok) throw new Error("rate fetch failed");
    const data = await res.json();
    if (data?.rates) {
      rates = { ...rates, ...data.rates };
      rateStatus = "实时汇率来自 exchangerate-api.com";
    }
  } catch (e) {
    rateStatus = "使用本地汇率，网络不可用";
  } finally {
    updateRateInfo();
  }
}

function updateRateInfo() {
  const cur = currencySelect.value;
  const rate = rates[cur] ?? 1;
  rateInfo.textContent = `1 CNY ≈ ${rate.toFixed(4)} ${cur} · ${rateStatus}`;
}

function toCNY(amount, currency) {
  const rate = rates[currency] ?? 1;
  // rate = 1 CNY -> rate currency; amount currency -> CNY = amount / rate
  return amount / rate;
}

function pickRandom(arr, count) {
  const pool = [...arr];
  const result = [];
  while (pool.length && result.length < count) {
    const idx = Math.floor(Math.random() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

function formatCount(num) {
  if (num >= 1000) return `${Math.round(num)}`;
  if (num >= 10) return `${num.toFixed(1)}`;
  if (num >= 1) return `${num.toFixed(2)}`;
  return num < 0.01 ? "不到 0.01" : num.toFixed(3);
}

function renderResults(list) {
  resultsEl.innerHTML = "";
  if (!list.length) {
    emptyEl.style.display = "block";
    return;
  }
  emptyEl.style.display = "none";
  list.forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.style.animationDelay = `${i * 50}ms`;
    card.innerHTML = `
      <div class="result-head">
        <span class="icon">${item.icon}</span>
        <div>
          <div class="name">${item.name}</div>
          <div class="count">≈ ${item.count} ${item.unit || "份"}</div>
        </div>
      </div>
      <p class="desc">${item.desc}</p>
    `;
    resultsEl.appendChild(card);
  });
}

function calculate() {
  const raw = parseFloat(amountInput.value);
  if (Number.isNaN(raw) || raw <= 0) {
    emptyEl.textContent = "请输入大于 0 的金额。";
    emptyEl.style.display = "block";
    resultsEl.innerHTML = "";
    return;
  }

  const currency = currencySelect.value;
  const amountCNY = toCNY(raw, currency);

  const selected = pickRandom(items, 10);
  const result = selected.map((item) => {
    const count = amountCNY / item.price;
    return {
      ...item,
      count: formatCount(count),
      unit: item.unit || (count >= 1 ? "份" : "份"),
    };
  });

  renderResults(result);
}

function randomAmount() {
  const val = (Math.random() * 999 + 1).toFixed(1);
  amountInput.value = val;
  calculate();
}

function share() {
  const text = Array.from(resultsEl.querySelectorAll(".result-card .name")).map((_, i) => {
    const name = resultsEl.querySelectorAll(".result-card .name")[i].textContent;
    const count = resultsEl.querySelectorAll(".result-card .count")[i]?.textContent || "";
    return `${name} ${count}`;
  });
  const summary = text.length ? text.join("；") : "我正在测试“你的钱有多值钱”，快来试试！";
  const payload = {
    title: "你的钱有多值钱",
    text: summary,
    url: location.href,
  };

  if (navigator.share) {
    navigator.share(payload).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(`${payload.title}\n${payload.text}\n${payload.url || ""}`);
    alert("已复制结果，去粘贴分享吧！");
  } else {
    alert(summary);
  }
}

calcBtn.addEventListener("click", calculate);
randomBtn.addEventListener("click", randomAmount);
shareBtn.addEventListener("click", share);
currencySelect.addEventListener("change", updateRateInfo);

fetchRates();
updateRateInfo();


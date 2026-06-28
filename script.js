// ==================== 价格配置 ====================
const projectDetails = {
    silver: { name: '银币', a: { desc: '100万银币', price: 50 }, b: { desc: '500万银币', price: 200 }, c: { desc: '1000万银币', price: 350 } },
    exp: { name: '单车经验', a: { desc: '1万经验', price: 60 }, b: { desc: '5万经验', price: 260 }, c: { desc: '10万经验', price: 480 } },
    winrate: { name: '胜率', a: { desc: '提升1%', price: 80 }, b: { desc: '提升3%', price: 220 }, c: { desc: '提升5%', price: 350 } },
    average: { name: '场均', a: { desc: '场均提升100', price: 70 }, b: { desc: '场均提升300', price: 190 }, c: { desc: '场均提升500', price: 300 } },
    mmedal: { name: 'M章', a: { desc: '1个M章', price: 90 }, b: { desc: '3个M章', price: 240 }, c: { desc: '5个M章', price: 380 } },
    rings: { name: '三环', a: { desc: '一环', price: 100 }, b: { desc: '二环', price: 280 }, c: { desc: '三环', price: 500 } },
    rating: { name: '评级', a: { desc: '提升1级', price: 120 }, b: { desc: '提升2级', price: 300 }, c: { desc: '提升3级', price: 520 } }
};
const playerRates = { jia: 1.5, yi: 1.3, bing: 1.1, ding: 1.0, wu: 0.9, ji: 0.8, geng: 0.7, xin: 0.65, ren: 0.6, gui: 0.5 };

// ==================== DOM 元素 ====================
// 板块切换
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// 代练相关
const projectRadios = document.querySelectorAll('input[name="project"]');
const detailRadios = document.querySelectorAll('input[name="detail"]');
const detailDescA = document.getElementById('detailDescA');
const detailDescB = document.getElementById('detailDescB');
const detailDescC = document.getElementById('detailDescC');
const detailPriceA = document.getElementById('detailPriceA');
const detailPriceB = document.getElementById('detailPriceB');
const detailPriceC = document.getElementById('detailPriceC');
const quantityInput = document.getElementById('quantityInput');
const qtyMinusBtn = document.getElementById('qtyMinus');
const qtyPlusBtn = document.getElementById('qtyPlus');
const playerRadios = document.querySelectorAll('input[name="player"]');
const urgentCheckbox = document.getElementById('urgentCheckbox');
const urgentRow = document.getElementById('urgentRow');
const basePriceDisplay = document.getElementById('basePriceDisplay');
const qtyMultiplierDisplay = document.getElementById('qtyMultiplierDisplay');
const playerMultiplierDisplay = document.getElementById('playerMultiplierDisplay');
const totalPriceDisplay = document.getElementById('totalPriceDisplay');
const copyBtn = document.getElementById('copyBtn');
const copyFeedback = document.getElementById('copyFeedback');
const contactCopyBtns = document.querySelectorAll('.contact-copy-btn');
const toast = document.getElementById('toast');

// 计算器相关
const calcTypeRadios = document.querySelectorAll('input[name="calcType"]');
const calcLabelUnit = document.getElementById('calcLabelUnit');
const calcTargetLabel = document.getElementById('calcTargetLabel');
const calcExpectedLabel = document.getElementById('calcExpectedLabel');
const currentValueInput = document.getElementById('currentValue');
const currentBattlesInput = document.getElementById('currentBattles');
const targetValueInput = document.getElementById('targetValue');
const expectedValueInput = document.getElementById('expectedValue');
const calcBtn = document.getElementById('calcBtn');
const calcResult = document.getElementById('calcResult');
const resultText = document.getElementById('resultText');
const resultDetail = document.getElementById('resultDetail');

// 新闻容器
const newsContainer = document.getElementById('newsContainer');

// ==================== 板块切换逻辑 ====================
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tabContents.forEach(tc => tc.classList.remove('active'));
        document.getElementById(targetTab).classList.add('active');
    });
});

// ==================== 代练价格计算 ====================
function getSelectedProject() {
    const checked = document.querySelector('input[name="project"]:checked');
    return checked ? checked.value : 'silver';
}
function getSelectedDetail() {
    const checked = document.querySelector('input[name="detail"]:checked');
    return checked ? checked.value : 'a';
}
function getBasePrice() {
    const project = getSelectedProject();
    const detail = getSelectedDetail();
    return projectDetails[project]?.[detail]?.price || 0;
}
function getQuantity() {
    let qty = parseInt(quantityInput.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 99) qty = 99;
    return qty;
}
function getPlayerRate() {
    const checked = document.querySelector('input[name="player"]:checked');
    return playerRates[checked?.value] || 1.0;
}
function isUrgent() { return urgentCheckbox.checked; }
function calculateTotal() {
    return getBasePrice() * getQuantity() * getPlayerRate() * (isUrgent() ? 1.1 : 1);
}

function updateDetailCards() {
    const project = getSelectedProject();
    const details = projectDetails[project];
    if (!details) return;
    detailDescA.textContent = details.a.desc;
    detailDescB.textContent = details.b.desc;
    detailDescC.textContent = details.c.desc;
    detailPriceA.textContent = `¥${details.a.price}`;
    detailPriceB.textContent = `¥${details.b.price}`;
    detailPriceC.textContent = `¥${details.c.price}`;
}

function refreshPrice() {
    const total = calculateTotal();
    basePriceDisplay.textContent = `¥${getBasePrice().toFixed(2)}`;
    qtyMultiplierDisplay.textContent = `×${getQuantity()}`;
    playerMultiplierDisplay.textContent = `×${getPlayerRate().toFixed(2)}`;
    totalPriceDisplay.textContent = `¥${total.toFixed(2)}`;
    urgentRow.style.display = isUrgent() ? 'flex' : 'none';
}

projectRadios.forEach(r => r.addEventListener('change', () => { updateDetailCards(); refreshPrice(); }));
detailRadios.forEach(r => r.addEventListener('change', refreshPrice));
qtyMinusBtn.addEventListener('click', () => { let q = getQuantity(); if (q > 1) { quantityInput.value = q - 1; refreshPrice(); } });
qtyPlusBtn.addEventListener('click', () => { let q = getQuantity(); if (q < 99) { quantityInput.value = q + 1; refreshPrice(); } });
quantityInput.addEventListener('input', () => {
    let v = parseInt(quantityInput.value, 10);
    if (!isNaN(v)) { if (v < 1) quantityInput.value = 1; if (v > 99) quantityInput.value = 99; }
    refreshPrice();
});
quantityInput.addEventListener('blur', () => {
    let v = parseInt(quantityInput.value, 10);
    if (isNaN(v) || v < 1) quantityInput.value = 1;
    else if (v > 99) quantityInput.value = 99;
    refreshPrice();
});
playerRadios.forEach(r => r.addEventListener('change', refreshPrice));
urgentCheckbox.addEventListener('change', refreshPrice);

copyBtn.addEventListener('click', async () => {
    const orderText = `【坦克世界闪击战代练订单】
🎯 项目：${projectDetails[getSelectedProject()].name}
📋 详情：方案${getSelectedDetail().toUpperCase()} - ${projectDetails[getSelectedProject()][getSelectedDetail()].desc}
🔢 数量：${getQuantity()}
👤 打手：${document.querySelector('input[name="player"]:checked')?.value || '未选'} (${getPlayerRate().toFixed(2)}x)
⚡ 加急：${isUrgent() ? '是' : '否'}
💰 总价：¥${calculateTotal().toFixed(2)}
📅 时间：${new Date().toLocaleString()}`;
    try {
        await navigator.clipboard.writeText(orderText);
        copyFeedback.classList.add('show');
        setTimeout(() => copyFeedback.classList.remove('show'), 1500);
        showToast('✅ 订单已复制');
    } catch (e) { showToast('❌ 复制失败'); }
});

contactCopyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        await navigator.clipboard.writeText(text);
        const orig = btn.textContent;
        btn.textContent = '✅ 已复制';
        setTimeout(() => btn.textContent = orig, 1500);
    });
});

// ==================== 计算器 ====================
function updateCalcLabels() {
    const type = document.querySelector('input[name="calcType"]:checked')?.value || 'winrate';
    const unit = type === 'winrate' ? '胜率' : '场均伤害';
    calcLabelUnit.textContent = unit;
    calcTargetLabel.textContent = unit;
    calcExpectedLabel.textContent = unit;
    calcResult.style.display = 'none';
}
calcTypeRadios.forEach(r => r.addEventListener('change', updateCalcLabels));

calcBtn.addEventListener('click', () => {
    const type = document.querySelector('input[name="calcType"]:checked')?.value || 'winrate';
    const cur = parseFloat(currentValueInput.value);
    const battles = parseInt(currentBattlesInput.value, 10);
    const target = parseFloat(targetValueInput.value);
    const exp = parseFloat(expectedValueInput.value);
    if ([cur, battles, target, exp].some(isNaN) || battles < 1) {
        showCalcResult('❌ 请完整填写有效数值', '', true);
        return;
    }
    if (exp <= target) {
        showCalcResult('⚠️ 无法达成', `预期每场${type==='winrate'?'胜率':'场均'}必须高于目标值`, true);
        return;
    }
    const needed = (target - cur) * battles / (exp - target);
    if (needed <= 0) {
        showCalcResult('✅ 已达目标', `当前数据已满足要求`);
    } else {
        const round = Math.ceil(needed);
        showCalcResult(`🎯 还需 ${round} 场`, `精确计算 ${needed.toFixed(2)} 场，向上取整`);
    }
});

function showCalcResult(title, detail, warning = false) {
    resultText.textContent = title;
    resultText.className = warning ? 'result-text warning' : 'result-text';
    resultDetail.textContent = detail;
    calcResult.style.display = 'block';
}

// ==================== 新闻（模拟公告） ====================
function loadNews() {
    // 模拟数据，后续可替换为 fetch('/api/announcements/active')
    const news = [
        { title: '🎉 新版本1.22更新预告', time: '2026-06-25', content: '全新YOH系列坦克即将上线，代练业务同步支持新车练级。' },
        { title: '⚡ 周末双倍经验活动', time: '2026-06-24', content: '本周六日全服银币和经验加成30%，代练效率大幅提升，欢迎下单！' },
        { title: '🛡️ 账号安全提醒', time: '2026-06-20', content: '近期出现第三方虚假代练，请认准本站唯一客服联系方式，谨防上当。' }
    ];
    if (news.length === 0) {
        newsContainer.innerHTML = '<div class="news-empty">暂无公告</div>';
        return;
    }
    newsContainer.innerHTML = news.map(n => `
        <div class="news-item">
            <div class="news-title">${n.title}</div>
            <div class="news-time">${n.time}</div>
            <div class="news-content">${n.content}</div>
        </div>
    `).join('');
}

// ==================== Toast ====================
function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// ==================== 初始化 ====================
function init() {
    updateDetailCards();
    refreshPrice();
    quantityInput.value = 1;
    updateCalcLabels();
    loadNews();
}
document.addEventListener('DOMContentLoaded', init);
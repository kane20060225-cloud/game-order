// ==================== 项目详情价格配置 ====================
const projectDetails = {
    silver: {
        name: '银币',
        a: { desc: '有紫狗牌有高级银币/百万', price: 8.9 },
        b: { desc: '无紫狗牌有高级银币/百万', price: 12.9 },
        c: { desc: '无紫狗牌无高级银币/百万', price: 14.9 }
    },
    exp: {
        name: '单车经验',
        a: { desc: '有紫狗牌有高级经验', price: 4 },
        b: { desc: '无紫狗牌有高级经验', price: 6 },
        c: { desc: '无紫狗牌无高级经验', price: 6.5 }
    },
    winrate: {
        name: '胜率',
        a: { desc: '胜率70%/10场', price: 19.8 },
        b: { desc: '胜率75%/10场', price: 24.8 },
        c: { desc: '胜率80%/10场', price: 34.8 }
    },
    average: {
        name: '场均',
        a: { desc: '场均3000/10场', price: 19.8 },
        b: { desc: '场均3300/10场', price: 28.8 },
        c: { desc: '场均3500/10场', price: 37.8 }
    },
    mmedal: {
        name: 'M章',
        a: { desc: '1个M章', price: 30 },
        b: { desc: '3个M章', price: 58 },
        c: { desc: '5个M章', price: 138 }
    },
    rings: {
        name: '三环',
        a: { desc: '一环', price: 78 },
        b: { desc: '二环', price: 158 },
        c: { desc: '三环', price: 248 }
    },
    rating: {
        name: '评级',
        a: { desc: '3千到4千/百分', price: 12 },
        b: { desc: '4千到5千/百分', price: 15 },
        c: { desc: '5千到6千/百分', price: 20 }
    }
};

// 打手倍率配置
const playerRates = {
    jia: 1.2,
    yi: 1.2,
    bing: 1.1,
    ding: 1.1,
    wu: 1.1,
    ji: 1.1,
    geng: 1.1,
    xin: 1.0,
    ren: 1.0,
    gui: 0.9
};

// ==================== DOM 元素 ====================
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

// ==================== 工具函数 ====================
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

function setQuantity(value) {
    let qty = parseInt(value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 99) qty = 99;
    quantityInput.value = qty;
}

function getSelectedPlayer() {
    const checked = document.querySelector('input[name="player"]:checked');
    return checked ? checked.value : 'ding';
}

function getPlayerRate() {
    const player = getSelectedPlayer();
    return playerRates[player] || 1.0;
}

function isUrgent() {
    return urgentCheckbox.checked;
}

function calculateTotal() {
    const base = getBasePrice();
    const qty = getQuantity();
    const playerRate = getPlayerRate();
    const urgentMultiplier = isUrgent() ? 1.1 : 1.0;
    return base * qty * playerRate * urgentMultiplier;
}

// 更新详情卡片显示
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

    // 确保当前选中的详情选项仍然有效（默认选中a）
    const currentDetail = getSelectedDetail();
    if (!['a', 'b', 'c'].includes(currentDetail)) {
        document.querySelector('input[name="detail"][value="a"]').checked = true;
    }
}

// 刷新总价显示
function refreshPrice() {
    const basePrice = getBasePrice();
    const qty = getQuantity();
    const playerRate = getPlayerRate();
    const urgent = isUrgent();
    const total = calculateTotal();

    basePriceDisplay.textContent = `¥${basePrice.toFixed(2)}`;
    qtyMultiplierDisplay.textContent = `×${qty}`;
    playerMultiplierDisplay.textContent = `×${playerRate.toFixed(2)}`;
    totalPriceDisplay.textContent = `¥${total.toFixed(2)}`;

    // 加急行显示/隐藏
    if (urgent) {
        urgentRow.style.display = 'flex';
    } else {
        urgentRow.style.display = 'none';
    }
}

// 生成订单文本
function generateOrderText() {
    const projectKey = getSelectedProject();
    const projectName = projectDetails[projectKey]?.name || projectKey;
    const detailKey = getSelectedDetail();
    const detailData = projectDetails[projectKey]?.[detailKey];
    const detailDesc = detailData ? detailData.desc : '';
    const detailLabel = { a: '方案A', b: '方案B', c: '方案C' }[detailKey];
    const qty = getQuantity();
    const playerKey = getSelectedPlayer();
    const playerNameMap = {
        jia: '情谊', yi: '大飞', bing: 'Hansza', ding: '梅花糕',
        wu: 'ZONK', ji: '菜鸡', geng: '子夜', xin: '土豆',
        ren: '谷', gui: '小黑子'
    };
    const playerName = playerNameMap[playerKey] || playerKey;
    const playerRate = getPlayerRate();
    const urgent = isUrgent();
    const total = calculateTotal();

    return `【坦克世界闪击战代练订单】
🎯 项目：${projectName}
📋 详情：${detailLabel} - ${detailDesc}
🔢 数量：${qty}
👤 打手：${playerName} (${playerRate}x)
⚡ 加急：${urgent ? '是 (+10%)' : '否'}
💰 总价：¥${total.toFixed(2)}
📅 下单时间：${new Date().toLocaleString()}
---
如需帮助请联系客服`;
}

// 复制文本到剪贴板
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            return true;
        } catch (e) {
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}

// 显示 Toast 消息
function showToast(message, isSuccess = true) {
    toast.textContent = message;
    toast.className = 'toast';
    if (isSuccess) {
        toast.classList.add('success');
    }
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ==================== 事件监听 ====================
// 代练项目切换
projectRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        updateDetailCards();
        refreshPrice();
    });
});

// 代练详情切换
detailRadios.forEach(radio => {
    radio.addEventListener('change', refreshPrice);
});

// 数量加减按钮
qtyMinusBtn.addEventListener('click', () => {
    let qty = getQuantity();
    if (qty > 1) {
        setQuantity(qty - 1);
        refreshPrice();
    }
});

qtyPlusBtn.addEventListener('click', () => {
    let qty = getQuantity();
    if (qty < 99) {
        setQuantity(qty + 1);
        refreshPrice();
    }
});

// 数量手动输入
quantityInput.addEventListener('input', () => {
    let val = parseInt(quantityInput.value, 10);
    if (!isNaN(val)) {
        if (val < 1) quantityInput.value = 1;
        if (val > 99) quantityInput.value = 99;
    }
    refreshPrice();
});

quantityInput.addEventListener('blur', () => {
    // 确保失焦后数值规范
    let val = parseInt(quantityInput.value, 10);
    if (isNaN(val) || val < 1) {
        quantityInput.value = 1;
    } else if (val > 99) {
        quantityInput.value = 99;
    }
    refreshPrice();
});

// 打手切换
playerRadios.forEach(radio => {
    radio.addEventListener('change', refreshPrice);
});

// 加急切换
urgentCheckbox.addEventListener('change', refreshPrice);

// 一键复制订单
copyBtn.addEventListener('click', async () => {
    const orderText = generateOrderText();
    const success = await copyToClipboard(orderText);
    if (success) {
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 1800);
        showToast('✅ 订单已复制，请发送给客服');
    } else {
        showToast('❌ 复制失败，请手动复制', false);
    }
});

// 客服联系方式复制
contactCopyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;
        const success = await copyToClipboard(textToCopy);
        if (success) {
            const originalText = btn.textContent;
            btn.textContent = '✅ 已复制';
            btn.style.color = '#3fb950';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.color = '';
            }, 1500);
            showToast('✅ 已复制到剪贴板');
        } else {
            showToast('❌ 复制失败', false);
        }
    });
});

// ==================== 初始化 ====================
function init() {
    updateDetailCards();
    refreshPrice();
    // 确保数量输入框初始值为1
    setQuantity(1);
}

// 启动
document.addEventListener('DOMContentLoaded', init);
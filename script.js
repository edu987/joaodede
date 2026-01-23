// ===============================
// LIMPA CONSOLE EM PRODUÇÃO (GITHUB)
// ===============================
if (location.hostname.includes("github.io")) {
    console.log = function () {};
    console.warn = function () {};
    console.error = function () {};
}

// ===============================
// REFERÊNCIAS DOM
// ===============================
const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModal = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const aberturaHeader = document.getElementById("abertura");
const encerramentoHeader = document.getElementById("fechamento");
const banner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("accept-cookies-btn");
const declineBtn = document.getElementById("decline-cookies-btn");
const telefone = document.getElementById("telefone");
const btnInfo = document.getElementById("btn-info");
const modalInfo = document.getElementById("modal-info");
const aberturaInfo = document.getElementById("time-abertura");
const fechamentoInfo = document.getElementById("time-fechamento");
const warnInfo = document.getElementById("warnInfo");


// ===============================
// CONFIGURAÇÃO FIXA DO RESTAURANTE
// ===============================
const OWNER_PHONE = "5532999296404";
const OWNER_ABERTURA = "17:00";
const OWNER_FECHAMENTO = "00:00";

// ===============================
// VARIÁVEIS GLOBAIS
// ===============================
let phone = OWNER_PHONE;
let abertura = OWNER_ABERTURA;
let fechamento = OWNER_FECHAMENTO;

let cart = [];
let saveCookies = false;
let aberto = false;

// ===============================
// FUNÇÕES UTILITÁRIAS
// ===============================
function formatPhoneNumber(value) {
    let formattedPhone = value.replace(/\D/g, '');
    if (formattedPhone.length >= 2) formattedPhone = formattedPhone.replace(/(\d{2})(\d+)/, '($1) $2');
    if (formattedPhone.length >= 7) formattedPhone = formattedPhone.replace(/(\d{5})(\d{4})/, '$1-$2');
    return formattedPhone;
}

function isValidPhone(phone) {
    return /^\(\d{2}\) \d{5}-\d{4}$/.test(phone);
}

function removeFormatting(phoneNumber) {
    return phoneNumber.replace(/\D/g, '');
}

function saveOwnerConfig() {
    updateTime();
    updateRestaurantStatus();
}

// ===============================
// EVENTOS DO MODAL INFO
// ===============================
if (telefone) {
    telefone.addEventListener("input", (e) => {
        telefone.value = formatPhoneNumber(e.target.value);
        saveOwnerConfig();
    });
}

function checkInfo() {
    if (!telefone || !aberturaInfo || !fechamentoInfo || !warnInfo) return true;

    if (!isValidPhone(telefone.value)) {
        warnInfo.textContent = "Número de telefone inválido!";
        warnInfo.classList.remove("hidden");
        return false;
    }

    if (!aberturaInfo.value.trim()) {
        warnInfo.textContent = "Preencha o horário de abertura!";
        warnInfo.classList.remove("hidden");
        return false;
    }

    if (!fechamentoInfo.value.trim()) {
        warnInfo.textContent = "Preencha o horário de fechamento!";
        warnInfo.classList.remove("hidden");
        return false;
    }

    warnInfo.classList.add("hidden");
    return true;
}

if (btnInfo) {
    btnInfo.addEventListener("click", () => {
        if (!checkInfo()) return;

        abertura = aberturaInfo.value.trim();
        fechamento = fechamentoInfo.value.trim();
        phone = removeFormatting(telefone.value);

        saveOwnerConfig();
        if (modalInfo) modalInfo.classList.add("hidden");
    });
}

// ===============================
// COOKIES
// ===============================
if (banner) banner.classList.remove("translate-y-full");

if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
        saveCookies = true;
        loadDataFromCookies();
        saveDataToCookies();
        banner.classList.add("hidden");
    });
}

if (declineBtn) {
    declineBtn.addEventListener("click", () => {
        saveCookies = false;
        banner.classList.add("hidden");
    });
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    return document.cookie.split(";").map(c => c.trim()).find(c => c.startsWith(nameEQ))?.substring(nameEQ.length) || null;
}

function saveDataToCookies() {
    if (!saveCookies) return;
    if (phone) setCookie("phone", phone, 1);
    if (abertura) setCookie("abertura", abertura, 1);
    if (fechamento) setCookie("fechamento", fechamento, 1);
}

function loadDataFromCookies() {
    if (!saveCookies) return;

    const savedPhone = getCookie('phone') || "";
    const savedAbertura = getCookie('abertura') || "";
    const savedEncerramento = getCookie('fechamento') || "";

    if (telefone && savedPhone && telefone.value.trim() === "") {
        telefone.value = formatPhoneNumber(savedPhone);
    }

    if (aberturaInfo && savedAbertura && aberturaInfo.value.trim() === "") {
        aberturaInfo.value = savedAbertura;
        abertura = savedAbertura;
    }

    if (fechamentoInfo && savedEncerramento && fechamentoInfo.value.trim() === "") {
        fechamentoInfo.value = savedEncerramento;
        fechamento = savedEncerramento;
    }

    updateTime();
    updateRestaurantStatus();
}


// ===============================
// HORÁRIO
// ===============================
function updateTime() {
    if (aberturaHeader) aberturaHeader.textContent = abertura;
    if (encerramentoHeader) encerramentoHeader.textContent = fechamento;
}

function restauranteAberto(agora, abre, fecha) {
    return fecha > abre
        ? agora >= abre && agora < fecha
        : agora >= abre || agora < fecha;
}

function updateRestaurantStatus() {
    const span = document.getElementById("date-span");
    if (!span) return;

    const now = new Date();
    const agora = now.getHours() * 60 + now.getMinutes();

    const [ah, am] = abertura.split(":").map(Number);
    const [fh, fm] = fechamento.split(":").map(Number);

    aberto = restauranteAberto(agora, ah * 60 + am, fh * 60 + fm);

    span.classList.toggle("bg-green-600", aberto);
    span.classList.toggle("bg-red-500", !aberto);
}

updateRestaurantStatus();
setInterval(updateRestaurantStatus, 15000);

// ===============================
// CARRINHO
// ===============================
if (cartBtn && cartModal) {
    cartBtn.addEventListener("click", () => {
        cartModal.classList.remove("hidden");
        cartModal.classList.add("flex");
        updateCartModal();
    });
}

if (cartModal) {
    cartModal.addEventListener("click", (e) => {
        if (e.target === cartModal || e.target === closeModal) {
            cartModal.classList.add("hidden");
            cartModal.classList.remove("flex");
        }
    });
}

if (menu) {
    menu.addEventListener("click", (e) => {
        const btn = e.target.closest(".add-to-cart-btn");
        if (!btn) return;
        addToCart(btn.dataset.name, parseFloat(btn.dataset.price));
    });
}

function addToCart(name, price) {
    const item = cart.find(i => i.name === name);
    item ? item.quantity++ : cart.push({ name, price, quantity: 1 });
    updateCartModal();
}

function updateCartModal() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        cartItemsContainer.insertAdjacentHTML("beforeend", `
            <div class="flex justify-between p-4">
                <div>${item.name} (${item.quantity})</div>
                <button class="remove-cart-btn" data-name="${item.name}">Remover</button>
            </div>
        `);
    });

    if (cartTotal) cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    if (cartCounter) cartCounter.textContent = cart.length;
}

if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
        if (!aberto) return showToast("⛔ Restaurante fechado", "#ef4444");
        if (!cart.length) return;
        window.open(`https://wa.me/${phone}`, "_blank");
        cart = [];
        updateCartModal();
    });
}

// ===============================
// TOAST
// ===============================
function showToast(text, bg) {
    Toastify({ text, duration: 3000, style: { background: bg } }).showToast();
}

// ===============================
// GARANTE MODAL INFO FECHADO
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    if (modalInfo) modalInfo.classList.add("hidden");
    updateTime();
});

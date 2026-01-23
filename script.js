// Referências DOM
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
const aberturaInfo = document.getElementById("abertura-info");
const fechamentoInfo = document.getElementById("fechamento-info");
const warnInfo = document.getElementById("warn-info");
const btnInfo = document.getElementById("btn-info");
const modalInfo = document.getElementById("modal-info");



// CONFIGURAÇÃO FIXA DO RESTAURANTE
const OWNER_PHONE = "5532999296404";
const OWNER_ABERTURA = "17:00";
const OWNER_FECHAMENTO = "00:00";

// VARIÁVEIS GLOBAIS USADAS PELO SISTEMA
let phone = OWNER_PHONE;
let abertura = OWNER_ABERTURA;
let fechamento = OWNER_FECHAMENTO;

let cart = [];
let saveCookies = false;
let aberto = false;


// Formatar número de telefone
function formatPhoneNumber(value) {
    let formattedPhone = value.replace(/\D/g, '');
    if (formattedPhone.length >= 2) formattedPhone = formattedPhone.replace(/(\d{2})(\d+)/, '($1) $2');
    if (formattedPhone.length >= 7) formattedPhone = formattedPhone.replace(/(\d{5})(\d{4})/, '$1-$2');
    return formattedPhone;
}

// Função para validar o telefone no formato (XX) XXXXX-XXXX
function isValidPhone(phone) {
    const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/; 
    return phoneRegex.test(phone); 
}

function saveOwnerConfig() {
    updateTime();
    updateRestaurantStatus();
}


// Formatar telefone enquanto digita
telefone.addEventListener("input", (event) => {
    telefone.value = formatPhoneNumber(event.target.value);
    saveOwnerConfig();
});

// Verificar dados antes de salvar
function checkInfo() {
    if (!isValidPhone(telefone.value)) {
        warnInfo.textContent = "Número de telefone inválido! Use o formato (XX) XXXXX-XXXX.";
        warnInfo.classList.remove("hidden");
        return false;
    }

    if (!aberturaInfo.value || aberturaInfo.value.trim() === "") {
        warnInfo.textContent = "Preencha o horário de abertura!";
        warnInfo.classList.remove("hidden");
        return false;
    }

    if (!fechamentoInfo.value || fechamentoInfo.value.trim() === "") {
        warnInfo.textContent = "Preencha o horário de fechamento!";
        warnInfo.classList.remove("hidden");
        return false;
    }

    warnInfo.classList.add("hidden");
    return true;
}

// Salvar horário e telefone no cookie
btnInfo.addEventListener("click", () => {
    if (!checkInfo()) {
        return;
    }

    console.log("Se você esta vendo isso, Obrigado por testar meu projeto! ;)");
    abertura = aberturaInfo.value.trim();
    fechamento = fechamentoInfo.value.trim();
    phone = removeFormatting(telefone.value);
    
    updateTime();
    saveOwnerConfig();
    modalInfo.classList.add("hidden");
});


//remover os caracteres que não precisa
function removeFormatting(phoneNumber) {
    return phoneNumber.replace(/\D/g, ''); 
}

// Mostrar ou esconder banner de cookies
banner.classList.remove("translate-y-full");

acceptBtn.addEventListener("click", () => {
    saveCookies = true;
    loadDataFromCookies();
    saveDataToCookies();
    banner.classList.add("hidden");
});

declineBtn.addEventListener("click", () => {
    saveCookies = false;
    banner.classList.add("hidden");
});

// Função para definir cookies
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

// Salvar dados no cookie
function saveDataToCookies() {
    try {
        if (phone) setCookie('phone', phone, 1);
        if (abertura) setCookie('abertura', abertura, 1);
        if (fechamento) setCookie('fechamento', fechamento, 1);
    } catch (error) {
        console.error("Erro ao salvar cookies:", error);
    }
}

// Carregar dados dos cookies
function loadDataFromCookies() {
    if (!saveCookies) return; 

    const savedPhone = getCookie('phone') || "";
    const savedAbertura = getCookie('abertura') || "00:00";
    const savedEncerramento = getCookie('fechamento') || "00:00";

    const FPhone = formatPhoneNumber(savedPhone);

    if (savedPhone && telefone.value.trim() === "") telefone.value = FPhone;
    if (savedAbertura && aberturaInfo.value.trim() === "") aberturaInfo.value = savedAbertura;
    if (savedEncerramento && fechamentoInfo.value.trim() === "") fechamentoInfo.value = savedEncerramento;
}

// Obter valor do cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function updateTime() {
    aberturaHeader.textContent = abertura;
    encerramentoHeader.textContent = fechamento;
}


telefone.addEventListener("input", saveOwnerConfig);
aberturaInfo.addEventListener("change", saveOwnerConfig);
fechamentoInfo.addEventListener("change", saveOwnerConfig);


// Atualizar status de aberto/fechado
function updateRestaurantStatus() {
    const now = new Date();
    const agoraMin = now.getHours() * 60 + now.getMinutes();

    const [ah, am] = abertura.split(":").map(Number);
    const [fh, fm] = fechamento.split(":").map(Number);

    const aberturaMin = ah * 60 + am;
    const fechamentoMin = fh * 60 + fm;

    const spanItem = document.getElementById("date-span");

    aberto = restauranteAberto(agoraMin, aberturaMin, fechamentoMin);

    if (aberto) {
        spanItem.classList.replace("bg-red-500", "bg-green-600");
    } else {
        spanItem.classList.replace("bg-green-600", "bg-red-500");
    }
}

updateRestaurantStatus();
setInterval(updateRestaurantStatus, 15000);


// Abre o modal do carrinho
cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
    updateCartModal();
});


// Fecha o modal do carrinho
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal || event.target === closeModal) {
        cartModal.classList.add("hidden");
        cartModal.classList.remove("flex");
    }
});


// Adiciona item ao carrinho
menu.addEventListener("click", (event) => {
    const parentButton = event.target.closest(".add-to-cart-btn");
    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

// Função para adicionar item ao carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cart.push({ name, price, quantity: 1 }); 
    }
    updateCartModal();
}

// Atualiza o modal do carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = ""; 
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.innerHTML = `
           <div class="flex justify-between items-center border-black p-4">
    <div>
        <div class="font-bold">Nome do item:</div>
        <div class="font-sans">${item.name}</div>
        <div class="font-bold">
        <p class="font-bold">Quantidade:</p> 
        <button class=" btn-remove bg-red-500 text-white px-2 py-1 hover:bg-red-600 rounded-full" data-name="${item.name}">
         -
         </button>
        <span class="font-sans">${item.quantity}</span>
        <button class="btn-add bg-red-500 text-white px-2 py-1 hover:bg-red-600 rounded-full" data-name="${item.name}">
         +
         </button>
        </div>
        <div class="font-bold">Preço: <span class="font-sans">${item.price.toFixed(2)}</span></div>
    </div>
    <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 remove-cart-btn" data-name="${item.name}">
        Remover
    </button>
</div>

        `;
        total += item.price * item.quantity; 
        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    cartCounter.textContent = cart.length; 
}

// Remove item do carrinho
cartItemsContainer.addEventListener("click", (event) => {
    const name = event.target.getAttribute("data-name");
    
    if (event.target.classList.contains("remove-cart-btn")) {
        const index = cart.findIndex(item => item.name === name);
        cart.splice(index, 1);
        updateCartModal();
    }

    if (event.target.classList.contains("btn-remove")) {
        removeItemCart(name);
    }

    if (event.target.classList.contains("btn-add")) {
        addToCart(name);
    }
});

// Função para remover item do carrinho
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        const item = cart[index];
        item.quantity > 1 ? item.quantity-- : cart.splice(index, 1);
        updateCartModal();
    }
}

function restauranteAberto(agoraMin, aberturaMin, fechamentoMin) {
    if (fechamentoMin > aberturaMin) {
        return agoraMin >= aberturaMin && agoraMin < fechamentoMin;
    } else {
        // Fecha depois da meia-noite
        return agoraMin >= aberturaMin || agoraMin < fechamentoMin;
    }
}



// Finaliza a compra
checkoutBtn.addEventListener("click", () => {

    if (!aberto) {
        showToast("⛔ Restaurante fechado no momento", "#ef4444");
        return;
    }

    if (cart.length === 0) {
        addressWarn.textContent = "Carrinho está vazio!";
        addressWarn.classList.remove("hidden");
        return;
    }

    if (phone === "") {
        addressWarn.textContent = "Número do WhatsApp não configurado!";
        addressWarn.classList.remove("hidden");
        return;
    }

    addressWarn.classList.add("hidden");

    const total = cartTotal.textContent;
    const cartItems = cart.map(item =>
        `${item.name}\nQtd: ${item.quantity}\nR$ ${item.price.toFixed(2)}\n---`
    ).join("\n");

    const message = encodeURIComponent(
        `${cartItems}\nTotal: ${total}\nObservações: ${addressInput.value}`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    addressInput.value = "";
    updateCartModal();

    checkoutBtn.disabled = true;
    setTimeout(() => checkoutBtn.disabled = false, 3000);
});


// Exibe notificações (toast)
function showToast(message, backgroundColor) {
    Toastify({
        text: message,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: { background: backgroundColor },
    }).showToast();
}

// Garante que o modal nunca apareça
document.addEventListener("DOMContentLoaded", () => {
    const modalInfo = document.getElementById("modal-info");
    if (modalInfo) {
        modalInfo.classList.add("hidden");
    }
});

window.addEventListener("load", updateTime);


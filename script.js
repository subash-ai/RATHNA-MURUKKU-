const cartToggle = document.getElementById("cartToggle");
const cartClose = document.getElementById("cartClose");
const cartPanel = document.getElementById("cartPanel");
const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.querySelector(".cart-count");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const productButtons = document.querySelectorAll(".product button");

const cart = [];

function formatCurrency(value) {
  return `₹${value}`;
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = "0.6";
    return;
  }

  checkoutBtn.disabled = false;
  checkoutBtn.style.opacity = "1";

  cart.forEach((item, index) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${formatCurrency(item.price)} x ${item.quantity}</p>
      </div>
      <div class="cart-item-qty">
        <button type="button" data-action="decrease" data-index="${index}">-</button>
        <input class="cart-qty-input" type="number" min="1" value="${item.quantity}" data-index="${index}" />
        <button type="button" data-action="increase" data-index="${index}">+</button>
      </div>
      <button class="cart-item-remove" type="button" data-action="remove" data-index="${index}">Remove</button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalNode = document.querySelector(".cart-total strong");
  if (totalNode) totalNode.textContent = formatCurrency(total);
}

function addToCart(name, price, quantity = 1) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ name, price, quantity });
  }

  updateCartCount();
  renderCart();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

function changeQuantity(index, delta) {
  if (!cart[index]) {
    return;
  }

  cart[index].quantity += delta;

  if (cart[index].quantity < 1) {
    removeFromCart(index);
    return;
  }

  updateCartCount();
  renderCart();
}

function setCartQuantity(index, quantity) {
  if (!cart[index]) {
    return;
  }

  if (quantity < 1) {
    removeFromCart(index);
    return;
  }

  cart[index].quantity = quantity;
  updateCartCount();
  renderCart();
}

function openCart() {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
}

productButtons.forEach(button => {
  const product = button.closest(".product");
  const name = product.querySelector("h3").textContent;
  const priceText = product.querySelector("span.price").textContent;
  const quantityInput = product.querySelector(".bulk-qty");
  const price = Number(priceText.replace(/[^0-9.\-]/g, "")) || 0;

  button.textContent = "Add to Cart";
  button.addEventListener("click", () => {
    const quantity = Math.max(1, Number(quantityInput?.value) || 1);
    addToCart(name, price, quantity);
    if (quantityInput) quantityInput.value = "1";
  });
});

cartItemsContainer.addEventListener("input", event => {
  const target = event.target;
  if (!target.classList.contains("cart-qty-input")) {
    return;
  }

  const index = Number(target.dataset.index);
  const quantity = Math.max(1, Number(target.value) || 1);
  if (Number(target.value) !== quantity) {
    target.value = quantity;
  }
  setCartQuantity(index, quantity);
});

cartToggle.addEventListener("click", () => {
  if (cartPanel.classList.contains("open")) {
    closeCart();
  } else {
    openCart();
  }
});

cartClose.addEventListener("click", closeCart);

cartItemsContainer.addEventListener("click", event => {
  const action = event.target.dataset.action;
  const index = Number(event.target.dataset.index);

  if (action === "remove") {
    removeFromCart(index);
  }

  if (action === "decrease") {
    changeQuantity(index, -1);
  }

  if (action === "increase") {
    changeQuantity(index, 1);
  }
});

clearCartBtn.addEventListener("click", () => {
  cart.length = 0;
  updateCartCount();
  renderCart();
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    return;
  }

  const lines = cart.map(item => `${item.quantity} x ${item.name} = ₹${item.price * item.quantity}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const message = `Hi, I would like to order:\n${lines.join("\n")}\nTotal: ₹${total}`;
  const url = `https://wa.me/8754127143?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
});

renderCart();
updateCartCount();
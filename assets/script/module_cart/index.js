
import createElement from '../../lib/create-element.js';
import escapeHtml from '../../lib/escape-html.js';

import Modal from '../module_modal/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.modal = new Modal();
    this.addEventListeners();
  }

  addProduct(product) {
    let productIsFinded = this.cartItems.find((obj) => obj.product.id === product.id);
    if (productIsFinded){
      productIsFinded.count += 1;
    } else {
      productIsFinded = {
        product: product,
        count: 1,
      };

      this.cartItems.push(productIsFinded);
    };

    this.onProductUpdate(productIsFinded);
  }

  updateProductCount(productId, amount) {
    let productIsFinded = this.cartItems.find((obj) => obj.product.id === productId);
    if (productIsFinded){
      productIsFinded.count += amount;

      if (productIsFinded.count === 0) this.cartItems.splice(this.cartItems.indexOf(productIsFinded), 1);

    };

    this.onProductUpdate(productIsFinded);
  }

  isEmpty() {
    if (this.cartItems.length === 0){
      return true;
    } else {
      return false;
    }
  }

  getTotalCount() {
    let totalCount = 0;
    if (this.cartItems.length !== 0){
      for (const cartItem of this.cartItems){
        totalCount += cartItem.count;
      };
    };
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;
    if (this.cartItems.length !== 0){
      for (const cartItem of this.cartItems){
        totalPrice += cartItem.product.price*cartItem.count;
      };
    };
    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">Руб. ${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Ваши данные:</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Ваше Имя" required >
        <input name="email" type="email" class="cart-form__input" placeholder="Почта" required >
        <input name="tel" type="tel" class="cart-form__input" placeholder="Телефон" required>
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Адрес:" required>
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">Всего за заказ:</span>
            <span class="cart-buttons__info-price">Рублей :${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">Заказать</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal.setTitle("Ваш заказ:");
    this.cartRender = document.createElement("DIV");
    for (let productItem of this.cartItems){
      this.cartRender.append(this.renderProduct(productItem.product, productItem.count));
    };
    this.cartRender.append(this.renderOrderForm());

    this.modal.setBody(this.cartRender);
    this.modal.open();

    this.cartRender.addEventListener("click", event => {
      if (event.target.closest(".cart-counter__button_minus")){
        let productId = event.target.closest(".cart-product").dataset.productId;
        this.updateProductCount(productId, -1);
      };
  
      if (event.target.closest(".cart-counter__button_plus")){
        let productId = event.target.closest(".cart-product").dataset.productId;
        this.updateProductCount(productId, 1);
      }
    });

    document.querySelector(".cart-form").addEventListener("submit", event => {
      this.onSubmit(event);
    });
  }

  onProductUpdate(cartItem) {
    if (document.body.classList.contains("is-modal-open")){
      if (cartItem.count === 0){
        this.cartRender.innerHTML = "";
        for (let productItem of this.cartItems){
          this.cartRender.append(this.renderProduct(productItem.product, productItem.count));
        };
        this.cartRender.append(this.renderOrderForm());
      } else {
        let productId = cartItem.product.id;
        let productCount = this.cartRender.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
        let productPrice = this.cartRender.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
        let infoPrice = this.cartRender.querySelector(`.cart-buttons__info-price`);
  
        productCount.innerHTML = cartItem.count;
        productPrice.innerHTML = `Руб. ${(cartItem.product.price*cartItem.count).toFixed(2)}`;
        
        infoPrice.innerHTML = `Руб. ${(this.getTotalPrice()).toFixed(2)}`;
      };

      if (this.isEmpty()){
        this.modal.close();
      };
    }
    this.cartIcon.update(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const submitBtn = document.querySelector(".cart-buttons__button");
    submitBtn.classList.add("is-loading");
    let orderForm = new FormData(document.querySelector(".cart-form"));

    fetch("https://httpbin.org/post", {
      method: "POST",
      body: orderForm
    })
    .then(response => {
      if (!response.ok) throw Error(response.statusText);
      return response;
    })
    .then(() => {
      submitBtn.classList.remove("is-loading");
      this.modal.setTitle("Заказ готов!!");
      this.cartItems = [];
      let communicator = document.createElement("DIV");
      communicator.classList.add("modal__body-inner");
      communicator.insertAdjacentHTML("beforeend", `
        <p style= 'color: red;'>
        Заказ принят, наш менеджер свяжется с Вами<br>
        в ближайшее время.<br>
        </p>
      `)
      this.modal.setBody(communicator);
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}
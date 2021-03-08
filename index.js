import RibbonMenu from '/assets/script/module_ribbon/index.js';
import categories from '/assets/script/module_ribbon/categories.js';

import ProductsGrid from '/assets/script/module_product-grid/index.js';

import CartIcon from '/assets/script/module_cartIcon/index.js';
import Cart from '/assets/script/module_cart/index.js';

export default class Main {

  constructor() {
    this.ribbonMenu = new RibbonMenu(categories);
    this.cartIcon = new CartIcon();
    this.cart = new Cart(this.cartIcon);
    this.addEventListeners();
  }

  async render() {
    let ribbonMenuBody = document.querySelector('[data-ribbon-holder]');
    ribbonMenuBody.append(this.ribbonMenu.elem);

    let cartIconBody = document.querySelector('[data-cart-icon-holder]');
    cartIconBody.append(this.cartIcon.elem);

    const adres = `products.json`;
    let response = await fetch(adres);
    this.productsArray = await response.json();

    this.productsGrid = new ProductsGrid(this.productsArray);
    let productBody = document.querySelector('[data-products-grid-holder]');
    productBody.append(this.productsGrid.elem);

    this.productsGrid.updateFilter({
      noNatural: document.getElementById('natural-checkbox').checked,
      deliveryOnly: document.getElementById('delivery-checkbox').checked,
      category: this.ribbonMenu.value
    });
  }

  addEventListeners() {
    document.body.addEventListener('product-add', (event) => {
      let selectedProductId = event.detail;
      let findResult = this.productsArray.find((item) =>
        (item.id == selectedProductId)
      );
      if (!findResult) {
        return;
      }
      this.cart.addProduct(findResult);
    });

    document.querySelector('[data-ribbon-holder]').addEventListener('ribbon-select', (event) => {
      this.productsGrid.updateFilter({
        category: event.detail
      });
    });

    document.addEventListener('change', (event) => {
      let checked = event.target.checked;
      if (event.target.id == "delivery-checkbox") {
        this.productsGrid.updateFilter({
          deliveryOnly: checked
        });
      }
      if (event.target.id == "natural-checkbox") {
        this.productsGrid.updateFilter({
          noNatural: checked
        });
      }
    });
  }
}

$(document).ready(function(){
  $(".sl").slick({
    autoplay: true,
    autoplaySpeed: 3000,
    dots: true,
    arrows: false,
    fade: true,
  });
});

  
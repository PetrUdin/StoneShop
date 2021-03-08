import createElement from '../../lib/create-element.js';
import ProductCard from '../product_card/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = products;
    this.filters = {};
    this.render();
  }
  render() {
  
    this.elem = createElement(`<div class="products-grid"> 
      <div class="products-grid__inner"></div>
    </div>`);

    this.renderContent();
  }

  renderContent() {
    this.sub('inner').innerHTML = '';

    for (let product of this.products) {
      if (this.filters.noNatural && product.natural) {continue;}

      if (this.filters.deliveryOnly && !product.delivery) {continue;}
  
      if (this.filters.category && product.category != this.filters.category) {
        continue;
      }

      let card = new ProductCard(product);
      this.sub("inner").append(card.elem);
    }
  }

  updateFilter(filters) {
    Object.assign(this.filters, filters);
    this.renderContent();
  }

  sub(ref) {
    return this.elem.querySelector(`.products-grid__${ref}`);
  }
}

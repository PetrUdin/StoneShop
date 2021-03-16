
export default class ProductCard {
  constructor(product) {
    this.product = product;
    this.elem = this.render();
  }

  render(){
    let divCard = document.createElement("DIV");
    divCard.classList.add("card");

    let divCardTop = `
    <div class="card__top">
    <img src="/assets/images/products/${this.product.image}" class="card__image" alt="product">
    <span class="card__price">${this.product.price.toFixed(2)} Руб./м² </span>
    </div>
    <div class="card__body">
    <div class="card__title">${this.product.name}</div>
    <button type="button" class="card__button">
      <img src="/assets/images/icons/plus-icon.svg" alt="icon">
    </button>
    </div>
    `;
    divCard.insertAdjacentHTML("beforeend", divCardTop)


    const _this = this;
    divCard.addEventListener("click", function(event){
      if(event.target.closest("button.card__button")){
        let ev = new CustomEvent("product-add", {
          detail: _this.product.id,
          bubbles: true
        });
        divCard.dispatchEvent(ev);
      };
    });

    return divCard;
  }

}

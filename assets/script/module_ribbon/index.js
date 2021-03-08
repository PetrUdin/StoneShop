
export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.elem = document.createElement('div');
    this.elem.className = 'ribbon';

    let structure = `<nav class="ribbon__inner"></nav>`
    this.elem.insertAdjacentHTML(`beforeend`, structure);

    let ribbonInner = this.elem.querySelector('.ribbon__inner');

    for (let category of categories) {
      let categoryLink = `
        <a href="#" class="ribbon__item" data-id="${category.id}">${category.name}</a>
      `
      ribbonInner.insertAdjacentHTML(`beforeend`, categoryLink);
    }


    let links = this.elem.querySelectorAll('.ribbon__item');

    for (let link of links) {
      let handleClick = (event) => {
        event.preventDefault();
        let activeElement = this.elem.querySelector('.ribbon__item_active');
        if (activeElement) {
          activeElement.classList.remove('ribbon__item_active');
        }

        this.elem.dispatchEvent(new CustomEvent('ribbon-select', {
          detail: link.dataset.id,
          bubbles: true
        }));

        link.classList.add('ribbon__item_active');
      }

      link.addEventListener('click', handleClick);
    }
  }
}
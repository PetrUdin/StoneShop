
import createElement from '../../../assets/lib/create-element.js';

export default class Modal {
  constructor() {
    let structure = `
      <div class="modal">
        <div class="modal__overlay"></div>
        <div class="modal__inner">
          <div class="modal__header">
            <button type="button" class="modal__close">
              <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
            </button>
            <h3 class="modal__title">
            </h3>
          </div>
          <div class="modal__body">
          </div>
        </div>
      </div>
    `
    this.modal = document.createElement('div');
    this.modal.classList.add('container');
    this.modal.insertAdjacentHTML('afterbegin', structure);

    this.modalClose = this.modal.querySelector('.modal__close');
    this.modalClose.onclick = this.close;

    this.elem = document.body;
    this.elem.onkeydown = this.escape;
  }

  setTitle(title) {
    let modalTitle = this.modal.querySelector('.modal__title');
    modalTitle.textContent = title;
  }

  setBody(node) {
    let modalBody = this.modal.querySelector('.modal__body');
    modalBody.textContent = "";
    modalBody.append(node);
  }

  open() {
    this.elem.append(this.modal);
    this.elem.classList.add('is-modal-open');
  }

  close = () => {
    this.modal.remove();
    this.elem.classList.remove('is-modal-open');
  }

  escape = (event) => {
    if (event.code === 'Escape') {
      this.modal.remove();
      this.elem.classList.remove('is-modal-open');
    }
  }
}

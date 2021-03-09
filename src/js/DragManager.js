import getCoords from './utils/getCoords';
import exchange from './utils/exchange';

export default class DragManager {
  constructor(field) {
    this.dragObject = {};
    this.field = field;
  }

  init() {
    document.onmousemove = this.onMouseMove;
    document.onmouseup = this.onMouseUp;
    return this;
  }

  onMouseDown = (e) => {
    if (e.which !== 1) return;
    this.isMoved = false;
    const elem = e.target.closest('.draggable');

    if (!elem) return;
    this.dragObject.elem = elem;
    this.dragObject.downX = e.pageX;
    this.dragObject.downY = e.pageY;
  };

  onMouseMove = (e) => {
    if (!this.dragObject.elem) return;

    if (!this.dragObject.avatar) {
      const moveX = e.pageX - this.dragObject.downX;
      const moveY = e.pageY - this.dragObject.downY;
      if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) {
        return;
      }
      this.dragObject.avatar = this.createAvatar(e);
      if (!this.dragObject.avatar) {
        this.dragObject = {};
        return;
      }
      const coords = getCoords(this.dragObject.elem);
      this.dragObject.shiftX = this.dragObject.downX - coords.left;
      this.dragObject.shiftY = this.dragObject.downY - coords.top;
      this.startDrag(e);
    }
    this.dragObject.avatar.style.left = `${e.pageX - this.dragObject.shiftX}px`;
    this.dragObject.avatar.style.top = `${e.pageY - this.dragObject.shiftY}px`;
  };

  onMouseUp = (e) => {
    if (this.dragObject.avatar) {
      this.finishDrag(e);
    }
    this.dragObject = {};
  };

  finishDrag(e) {
    this.dropElem = this.findDroppable(e);
    if (!this.dropElem) {
      this.onDragCancel();
    } else {
      const dropCoords = this.getMatrixCoords(this.dropElem);
      const dragCoords = this.getMatrixCoords(this.dragObject.elem);
      const isXMove = Boolean(
        dropCoords.x === dragCoords.x
          && Math.abs(dropCoords.y - dragCoords.y) === 1,
      );
      const isYMove = Boolean(
        dropCoords.y === dragCoords.y
          && Math.abs(dropCoords.x - dragCoords.x) === 1,
      );
      if (!isXMove && !isYMove) {
        this.onDragCancel();
      } else {
        this.onDragEnd();
      }
    }
  }

  createAvatar = () => {
    const avatar = this.dragObject.elem;
    this.dragObject.clone = avatar.cloneNode();
    this.dragObject.clone.classList.add('clone');
    avatar.parentNode.insertBefore(this.dragObject.clone, avatar.nextSibling);
    const old = {
      parent: avatar.parentNode,
      nextSibling: avatar.nextSibling,
      position: avatar.position || '',
      left: avatar.left || '',
      top: avatar.top || '',
      zIndex: avatar.zIndex || '',
    };

    avatar.rollback = () => {
      old.parent.insertBefore(avatar, old.nextSibling);
      avatar.style.position = old.position;
      avatar.style.left = old.left;
      avatar.style.top = old.top;
      avatar.style.zIndex = old.zIndex;
      this.dragObject.clone.remove();
      this.dragObject.elem.style.removeProperty('visibility');
    };

    return avatar;
  };

  startDrag() {
    const { avatar } = this.dragObject;
    document.body.appendChild(avatar);
    avatar.style.zIndex = 9999;
    avatar.style.position = 'absolute';
  }

  findDroppable(event) {
    this.dragObject.avatar.style.visibility = 'hidden';
    const elem = document.elementFromPoint(event.clientX, event.clientY);
    this.dragObject.avatar.style.visibility = 'visible';
    if (elem == null) {
      return null;
    }
    return elem.closest('.empty');
  }

  onDragEnd = () => {
    this.dragObject.avatar.rollback();
    this.dragCoords = this.getMatrixCoords(this.dragObject.elem);
    this.dropCoords = this.getMatrixCoords(this.dropElem);
    exchange(this.dragObject.elem, this.dropElem, this.field);
    this.isMoved = true;
  };

  getMatrixCoords = (elem) => ({
    x: parseFloat(elem.dataset.index[0]),
    y: parseFloat(elem.dataset.index[2]),
  });

  onDragCancel = () => {
    this.dragObject.avatar.rollback();
  };
}

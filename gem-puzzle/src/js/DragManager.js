import getCoords from './utils/getCoords';
import exchange from './utils/exchange';

// const getEmptyCoords = () => {
//   const emptyChip = document.querySelector('.empty');
//   return {
//     x: parseFloat(emptyChip.dataset.index[0]),
//     y: parseFloat(emptyChip.dataset.index[2]),
//   };
// };
export default class DragManager {
  constructor(field) {
    this.dragObject = {};
    // this.field = document.querySelector('.field');
    this.field = field;
    // this.elem = '';
  }

  init() {
    document.onmousemove = this.onMouseMove;
    document.onmouseup = this.onMouseUp;
    // document.onmousedown = this.onMouseDown;
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

    // return false;
  };

  onMouseMove = (e) => {
    if (!this.dragObject.elem) return;

    if (!this.dragObject.avatar) {
      const moveX = e.pageX - this.dragObject.downX;
      const moveY = e.pageY - this.dragObject.downY;
      // console.log(moveX, moveY);
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

    // return false;
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
      // console.log(dragCoords, dropCoords);
      const isXMove = Boolean(
        dropCoords.x === dragCoords.x
          && Math.abs(dropCoords.y - dragCoords.y) === 1,
      );
      const isYMove = Boolean(
        dropCoords.y === dragCoords.y
          && Math.abs(dropCoords.x - dragCoords.x) === 1,
      );
      // console.log(isXMove, isYMove);
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
    // this.dragObject.clone.classList.remove('draggable');
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
      // this.dragObject.elem.style.width = 'auto';
      // this.dragObject.elem.style.height = 'auto';
    };

    return avatar;
  };

  startDrag() {
    const { avatar } = this.dragObject;
    document.body.appendChild(avatar);
    // let container = document.querySelector('.container');
    // container.appendChild(avatar);
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
    // console.log(elem.closest('.droppable'));
    return elem.closest('.empty');
  }

  onDragEnd = () => {
    this.dragObject.avatar.rollback();
    // this.dragObject.elem.classList.add('empty');
    // this.dropElem.classList.remove('empty');
    // this.dropElem.innerHTML = this.dragObject.elem.innerHTML;
    // this.dragObject.elem.innerHTML = '';
    // lala

    // this.nextDragEl = this.dragObject.elem.nextSibling;
    // const tempIndex = this.dragObject.elem.dataset.index;
    // this.dragObject.elem.dataset.index = this.dropElem.dataset.index;
    // this.dropElem.dataset.index = tempIndex;
    // this.field.insertBefore(
    //   this.dragObject.elem,
    //   this.dropElem.nextSibling,
    // );
    // this.field.insertBefore(this.dropElem, this.nextDragEl);
    this.dragCoords = this.getMatrixCoords(this.dragObject.elem);
    this.dropCoords = this.getMatrixCoords(this.dropElem);
    exchange(this.dragObject.elem, this.dropElem, this.field);
    // this.dropCoords = this.getMatrixCoords(this.dropElem);
    // this.lastIsDrop = true;
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

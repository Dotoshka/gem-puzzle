/* eslint-disable no-param-reassign */
export default function exchange(dragElem, emptyElem, section) {
  // Change index
  const tempIndex = dragElem.dataset.index;
  dragElem.dataset.index = emptyElem.dataset.index;
  emptyElem.dataset.index = tempIndex;
  // Change chips
  const nextDragElem = dragElem.nextSibling;
  const nextEmptyElem = emptyElem.nextSibling;
  section.insertBefore(dragElem, nextEmptyElem);
  section.insertBefore(emptyElem, nextDragElem);
  // return { x: emptyElem.dataset.index[0], y: emptyElem.dataset.index[2] };
}

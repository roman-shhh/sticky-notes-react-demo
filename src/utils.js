export const setNewOffset = (card, mouseMoveDir = { x: 0, y: 0 }) => {
  const offsetLeft = card.offsetLeft - mouseMoveDir.x;
  const offsetTop = card.offsetTop - mouseMoveDir.y;

  return {
    x: offsetLeft < 0 ? 0 : offsetLeft,
    y: offsetTop < 0 ? 0 : offsetTop,
  };
};

export function autoGrow(textAreaRef) {
  const { current } = textAreaRef;
  current.style.height = "auto"; // Reset the height
  current.style.height = textAreaRef.current.scrollHeight + "px"; // Set the new height
};

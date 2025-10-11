import { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import Trash from '../icons/Trash'
import Spinner from '../icons/Spinner'
import { setNewOffset, autoGrow } from '../utils.js'
import colors from "../assets/colors.json"
import Color from './Color.jsx'

const NoteCard = ({ note, setNotePosition, updateNoteBody, deleteNote, setZIndex }) => {
  const [position, setPositon] = useState(note.position);
  const [saving, setSaving] = useState(false);

  const mouseStartPos = useRef({ x: 0, y: 0 });

  const cardRef = useRef(null);
  const textAreaRef = useRef(null);
  const keyUpTimer = useRef(null);

  useEffect(() => {
    autoGrow(textAreaRef);
    if (!note.body) {
      textAreaRef.current.focus()
    }
  }, [note.body, textAreaRef]);


  // Вместо useEffect вызываем setNotePosition только при изменении позиции
  const handlePositionChange = (newPosition) => {
    setPositon(newPosition);
    setNotePosition({ id: note.$id, position: newPosition });
  };

  const mouseDown = (e) => {
    setZIndex(note.$id);

    if (e.target.className === "card-header") {
      mouseStartPos.current.x = e.clientX;
      mouseStartPos.current.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }
  };

  const mouseMove = (e) => {
    let mouseMoveDir = {
      x: mouseStartPos.current.x - e.clientX,
      y: mouseStartPos.current.y - e.clientY,
    };

    mouseStartPos.current.x = e.clientX;
    mouseStartPos.current.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    handlePositionChange(newPosition);
  };

  const mouseUp = () => {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  };

  const handleKeyUp = async () => {
    setSaving(true);

    if (keyUpTimer.current) {
        clearTimeout(keyUpTimer.current);
    }

    keyUpTimer.current = setTimeout(() => {
      updateNoteBody({ id: note.$id, body: textAreaRef.current.value })
      setSaving(false);
    }, 1500);
  };

  const handleDelete = () => {
    deleteNote(note.$id)
  };

  return (
    <div
      ref={cardRef}
      className='card'
      style={{
        backgroundColor: colors[colors.findIndex(el => el.id === note.color)].colorBody,
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: note.zIndex
      }}
      onMouseDown={mouseDown}
    >
      <div
        className="card-header"
        style={{ backgroundColor: colors[colors.findIndex(el => el.id === note.color)].colorHeader }}
      >
        <div className="card-header-buttons">
          <div className='delete-button' onClick={handleDelete}>
            <Trash />
          </div>

          {colors.map((color) => {
            if (color.id !== note.color) {
              return <Color key={color.id} color={color.id} noteId={note.$id} />
            }
          })}
        </div>

        {
          saving && (
            <div className="card-saving">
              <Spinner color={colors[colors.findIndex(el => el.id === note.color)].colorText} />
              <span style={{ color: colors[colors.findIndex(el => el.id === note.color)].colorText }}>Saving...</span>
            </div>
          )
        }
      </div>

      <div className="card-body">
        <textarea
          ref={textAreaRef}
          style={{ color: colors[colors.findIndex(el => el.id === note.color)].colorText }}
          defaultValue={note.body}
          onInput={() => {
            autoGrow(textAreaRef);
            setZIndex(note.$id);
          }}
          onFocus={() => {
            setZIndex(note.$id);
          }}
          onKeyUp={handleKeyUp}
        ></textarea>
      </div>
    </div>
  )
}


NoteCard.propTypes = {
  note: PropTypes.shape({
    $id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    body: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
    zIndex: PropTypes.number.isRequired,
  }).isRequired,
  setNotePosition: PropTypes.func.isRequired,
  updateNoteBody: PropTypes.func.isRequired,
  deleteNote: PropTypes.func.isRequired,
  setZIndex: PropTypes.func.isRequired,
};

export default NoteCard
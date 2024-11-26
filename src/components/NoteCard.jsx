import { useRef, useEffect, useState } from 'react'
import Trash from '../icons/Trash'
import Spinner from '../icons/Spinner'
import { setNewOffset, autoGrow } from '../utils.js'
import colors from "../assets/colors.json"
import Color from './Color.jsx'

const NoteCard = ({ note, setNotePosition, updateNoteBody, deleteNote, setZIndex }) => {
  const [position, setPositon] = useState(note.position);
  const [saving, setSaving] = useState(false);

  let mouseStartPos = { x: 0, y: 0 };

  const cardRef = useRef(null);
  const textAreaRef = useRef(null);
  const keyUpTimer = useRef(null);

  useEffect(() => {
    autoGrow(textAreaRef);
    if (!note.body) {
      textAreaRef.current.focus()
    }
  }, []);

  useEffect(() => {
    setNotePosition({ id: note.$id, position })
  }, [position]);

  const mouseDown = (e) => {
    setZIndex(note.$id);

    if (e.target.className === "card-header") {
      mouseStartPos.x = e.clientX;
      mouseStartPos.y = e.clientY;

      document.addEventListener("mousemove", mouseMove);
      document.addEventListener("mouseup", mouseUp);
    }
  };

  const mouseMove = (e) => {
    let mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    const newPosition = setNewOffset(cardRef.current, mouseMoveDir);
    setPositon(() => newPosition);
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

export default NoteCard
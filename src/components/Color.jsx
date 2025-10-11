import { useContext } from "react";
import PropTypes from "prop-types";
import { NotesContext } from "../context/NotesContextContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import colors from "../assets/colors.json"

const Color = ({ color, noteId }) => {
  const { setNotes } = useContext(NotesContext)
  const { saveToLocasStorage } = useLocalStorage()

  const changeColor = () => {
    setNotes(prevNotes => {
      const currentNoteIndex = prevNotes.findIndex((note) => note.$id === noteId);
      if (currentNoteIndex === -1) return prevNotes;
      const updatedNote = {
        ...prevNotes[currentNoteIndex],
        color: color,
      };
      const newNotes = [...prevNotes];
      newNotes[currentNoteIndex] = updatedNote;
      saveToLocasStorage(newNotes);
      return newNotes;
    });
  };

  return (
    <div className="color-box">
      <div
        onClick={changeColor}
        className="color"
        style={{ backgroundColor: colors[colors.findIndex(el => el.id === color)].colorHeader }}
      ></div>
    </div>
  );
};

Color.propTypes = {
  color: PropTypes.string.isRequired,
  noteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Color
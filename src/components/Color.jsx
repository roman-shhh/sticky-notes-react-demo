import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import colors from "../assets/colors.json"

const Color = ({ color, noteId }) => {
  const { notes, setNotes } = useContext(NotesContext)
  const { saveToLocasStorage } = useLocalStorage()

  const changeColor = () => {
    const currentNoteIndex = notes.findIndex((note) => note.$id === noteId);

    const updatedNote = {
      ...notes[currentNoteIndex],
      color: color,
    };

    const newNotes = [...notes];
    newNotes[currentNoteIndex] = updatedNote;
    setNotes(newNotes);
    saveToLocasStorage(newNotes)
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

export default Color
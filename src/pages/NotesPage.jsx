import { useRef, useCallback, useContext } from "react";
import { NotesContext } from "../context/NotesContext";
import NoteCard from '../components/NoteCard.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import Plus from "../icons/Plus.jsx";
import colors from "../assets/colors.json";

const NotesPage = () => {
  const { notes, setNotes } = useContext(NotesContext);

  const startingPos = useRef(10);

  const { saveToLocasStorage } = useLocalStorage()

  const setNotePosition = useCallback(({ id, position }) => {
    if (!id || !position) { return }
    const data = [...notes]
    const idx = data.findIndex(el =>  el.$id === id)
    if (idx >= 0) {
      data[idx].position = {...position}
      setNotes(() => data)
      saveToLocasStorage(data)
    }
  }, [notes]);

  const updateNoteBody = useCallback(({ id, body }) => {
    if (!id || body === undefined) { return }
    const data = [...notes]
    const idx = data.findIndex(el =>  el.$id === id)
    if (idx >= 0) {
      data[idx].body = body
      setNotes(() => data)
      saveToLocasStorage(data)
    }
  }, [notes]);

  const deleteNote = useCallback((id) => {
    if (!id) { return }
    const data = [...notes]
    const idx = data.findIndex(el =>  el.$id === id)
    if (idx >= 0) {
      data.splice(idx, 1)
      setNotes(() => data)
      saveToLocasStorage(data)
    }
  }, [notes]);

  const setZIndex = useCallback((id) => {
    const newNotes = [...notes]
    newNotes.forEach(note => {
      if (id !== note.$id) {
        note.zIndex -= 1
      } else {
        note.zIndex = 999
      }
    })
    setNotes(() => newNotes)
    saveToLocasStorage(newNotes)
  }, [notes]);

  const addNote = useCallback(() => {
    const id = Date.now();

    const newNote = {
      $id: id,
      body: '',
      color: colors[Math.floor(Math.random() * colors.length)].id,
      position: {
        x: startingPos.current,
        y: startingPos.current,
      },
      zIndex: 999
    };

    startingPos.current += 10;
    if (startingPos.current > 150) { startingPos.current = 10 }

    const newNotes = [newNote, ...notes]
    setNotes(() => newNotes);
    saveToLocasStorage(newNotes)
  }, [notes]);

  return (
    <div>
      {notes.map(note => (
        <NoteCard
          key={note.$id.toString()}
          note={note}
          setNotePosition={setNotePosition}
          updateNoteBody={updateNoteBody}
          deleteNote={deleteNote}
          setZIndex={setZIndex}
        />
      ))}

      <div id="controls">
        <div id="add-btn" onClick={addNote}>
          <Plus />
        </div>
      </div>
    </div>
  )
}

export default NotesPage
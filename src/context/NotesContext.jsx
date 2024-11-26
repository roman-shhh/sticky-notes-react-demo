import { createContext } from "react";
import { useState, useEffect } from "react";
import Spinner from "../icons/Spinner";
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { fakeData } from '../assets/fakeData.js'

export const NotesContext = createContext();

const NotesProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState();

  const { getLocalStorage, saveToLocasStorage } = useLocalStorage()

  useEffect(() => {
      init();
  }, []);

  const init = async () => {
    const lsData = getLocalStorage()
    if (!lsData) {
      setNotes(() => [...fakeData])
      saveToLocasStorage(fakeData)
    } else {
      setNotes(() => [...JSON.parse(lsData)])
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const contextData = { notes, setNotes };

  return (
    <NotesContext.Provider value={contextData}>
      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <Spinner size="100" />
        </div>
      ) : (
        children
      )}
    </NotesContext.Provider>
  );
};
export default NotesProvider;
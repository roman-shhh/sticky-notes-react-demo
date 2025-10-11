import { useCallback } from 'react';

export const useLocalStorage = () => {
  const lsNameData = 'sticky-notes-react-demo-data'

  const getLocalStorage = useCallback(() => {
    return localStorage.getItem(lsNameData)
  }, [lsNameData]);

  const saveToLocasStorage = useCallback((data) => {
    if (data) {
      localStorage.setItem(lsNameData, JSON.stringify(data))
    }
  }, [lsNameData]);

  return { getLocalStorage, saveToLocasStorage }
}
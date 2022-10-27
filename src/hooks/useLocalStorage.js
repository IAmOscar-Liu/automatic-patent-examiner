import { useState, useEffect } from "react";

const KEY = "automatic-patent-examiner";

const useLocalStorage = (initialValue) => {
  const getLocalStorage = () => {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      console.log(`Unable to get localstorage: ${e.message}`);
      return null;
    }
  };

  const setLocalStorage = (value) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(value));
    } catch (e) {
      console.log(`Unable to set localstorage: ${e.message}`);
    }
  };

  const [value, setValue] = useState(() => {
    const jsonValue = getLocalStorage();
    if (jsonValue !== null) {
      let oldValue = JSON.parse(jsonValue);
      oldValue = { ...initialValue, ...oldValue };

      if (
        oldValue.savedApplications &&
        Object.keys(oldValue.savedApplications).length > 0
      ) {
        const currentTS = +new Date();
        for (let savedDate in oldValue.savedApplications) {
          try {
            if (currentTS - +new Date(savedDate) > 60 * 60 * 24 * 31 * 1000) {
              delete oldValue.savedApplications[savedDate];
            }
          } catch (e) {
            delete oldValue.savedApplications[savedDate];
          }
        }
      }
      return oldValue;
    }
    if (typeof initialValue === "function") {
      return initialValue();
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    setLocalStorage(value);
  }, [value, setValue]);

  return [value, setValue];
};

export default useLocalStorage;

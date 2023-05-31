import { useState, useEffect } from "react";

const KEY = "automatic-patent-examiner";

const isValidLocalStorage = (jsonValue) => {
  try {
    if (
      typeof jsonValue.isDarkMode !== "boolean" ||
      typeof jsonValue.fontSize !== "number" ||
      typeof jsonValue.openTooltip !== "boolean" ||
      typeof jsonValue.showClaimElementKey !== "boolean" ||
      typeof jsonValue.synchronizeHighlight !== "boolean" ||
      typeof jsonValue.readingModePureText !== "boolean" ||
      typeof jsonValue.useDatabase !== "boolean" ||
      typeof jsonValue.savedApplications !== "object"
    )
      return false;

    for (let key of Object.keys(jsonValue.savedApplications)) {
      for (let item of jsonValue.savedApplications[key]) {
        if (
          typeof item.appId !== "string" ||
          typeof item.appTitle !== "string" ||
          typeof item.latestTS !== "number"
        )
          return false;
      }
    }

    return true;
  } catch (error) {
    console.log("Fail to parse localStorate");
    return false;
  }
};

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
    let oldValue = JSON.parse(jsonValue || "{}");
    if (isValidLocalStorage(oldValue)) {
      oldValue = {
        ...initialValue,
        ...oldValue,
        useDatabase:
          process.env.REACT_APP_SYSTEM_TYPE === "tipo"
            ? oldValue.useDatabase
            : false,
      };

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

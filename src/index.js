import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import EssentialDataContext from "./contexts/EssentialDataContext";
import XMLContext from "./contexts/XMLContext";
import UpdateParagraphContext from "./contexts/UpdateParagraphContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { defaultPersonalSettings } from "./dict/defaultPersonalSettings";

const Root = () => {
  const [value, setValue] = useLocalStorage({
    ...defaultPersonalSettings
  });

  return (
    <XMLContext>
      <EssentialDataContext personalSettings={value}>
        <UpdateParagraphContext>
          <App setLocalStorageValue={setValue} />
        </UpdateParagraphContext>
      </EssentialDataContext>
    </XMLContext>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  rootElement
);

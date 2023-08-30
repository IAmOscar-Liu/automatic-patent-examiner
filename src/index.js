import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import EssentialDataContext from "./contexts/EssentialDataContext";
import XMLContext from "./contexts/XMLContext";
import UpdateParagraphContext from "./contexts/UpdateParagraphContext";
import useLocalStorage from "./hooks/useLocalStorage";
import { defaultPersonalSettings } from "./dict/defaultPersonalSettings";
import { parseTipoCookie } from "./utils/parseTipoCookie";
import NotAllow from "./components/NotAllow";

const Root = () => {
  const [value, setValue] = useLocalStorage({
    ...defaultPersonalSettings,
  });

  // const sessionKey = process.env.REACT_APP_TIPO_SESSION_KEY;
  const sessionKey = "";

  if (!sessionKey || parseTipoCookie(document.cookie)[sessionKey])
    return (
      <XMLContext>
        <EssentialDataContext personalSettings={value}>
          <UpdateParagraphContext>
            <App setLocalStorageValue={setValue} />
          </UpdateParagraphContext>
        </EssentialDataContext>
      </XMLContext>
    );

  return <NotAllow />;
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  rootElement
);

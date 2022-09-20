import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import EssentialDataContext from "./contexts/EssentialDataContext";
import XMLContext from "./contexts/XMLContext";
import UpdateParagraphContext from "./contexts/UpdateParagraphContext";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <XMLContext>
      <EssentialDataContext>
        <UpdateParagraphContext>
          <App />
        </UpdateParagraphContext>
      </EssentialDataContext>
    </XMLContext>
  </React.StrictMode>,
  rootElement
);

import React, { useContext, useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import "./styles.css";
import { Link, Route, HashRouter as Router, Switch } from "react-router-dom";
import Popup from "reactjs-popup";
import DBResultPopup from "./components/DbResultPopup";
import DescriptionOfDrawings from "./components/DescriptionOfDrawings";
import DescriptionOfElement from "./components/DescriptionOfElement";
import FailedElements from "./components/FailedElements";
import FigureOfDrawings from "./components/FigureOfDrawings";
import MainTitle from "./components/MainTitle";
import SettingsPopup from "./components/SettingsPopup";
import SidebarLayout from "./components/SidebarLayout";
import { EssentialDataContextProvider } from "./contexts/EssentialDataContext";
import { UpdateParagraphContextProvider } from "./contexts/UpdateParagraphContext";
import { XMLContextProvider } from "./contexts/XMLContext";
import { useInit } from "./hooks/init";
import { useLoadXML } from "./hooks/loadXML";
import { reInit } from "./hooks/reInit";
import Abstract from "./pages/Abstract_v2";
import Claims from "./pages/Claims";
import Disclosure from "./pages/Disclosure";
import ModeForInvention from "./pages/ModeForInvention";
import SimpleClaims from "./pages/SimpleClaims";
import SimpleDescription from "./pages/SimpleDescription";
import Readme from "./pages/readme";
import Result from "./pages/result";
import { getPathName } from "./utils/getPathName";

export default function App({ setLocalStorageValue }) {
  const [XMLData, setXMLData] = useContext(XMLContextProvider);
  const [essentialData, setEssentialData] = useContext(
    EssentialDataContextProvider
  );

  const {
    setAllUpdateDisclosureParagraph,
    setAllUpdateModeForInventionParagraph,
    setAllUpdateClaimParagraph,
  } = useContext(UpdateParagraphContextProvider);

  const [isSettingPopupOpen, toggleIsSettingPopupOpen] = useState(false);
  const [isDBResultPopupOpen, toggleIsDBResultPopupOpen] = useState(false);

  const handleReInit = async (_essentialData, _setEssentialData, _payload) => {
    setAllUpdateDisclosureParagraph([]);
    setAllUpdateModeForInventionParagraph([]);
    setAllUpdateClaimParagraph([]);
    await reInit(_essentialData, _setEssentialData, _payload);
  };

  useLoadXML(XMLData.fileName, XMLData.fileContent, setXMLData);
  // console.log("Call init");
  useInit(
    XMLData,
    setXMLData,
    essentialData,
    setEssentialData,
    setAllUpdateDisclosureParagraph,
    setAllUpdateModeForInventionParagraph,
    setAllUpdateClaimParagraph,
    setLocalStorageValue
  );

  return (
    <div
      className="App"
      style={
        essentialData.pathName === "read-mode"
          ? {
              width: "150%",
              marginLeft: "-50%",
            }
          : {}
      }
    >
      <SidebarLayout>
        <DescriptionOfElement handleReInit={handleReInit} />
        <FigureOfDrawings handleReInit={handleReInit} />
        <DescriptionOfDrawings />
        <FailedElements handleReInit={handleReInit} />
      </SidebarLayout>
      <main
        className={`main ${
          essentialData.personalSettings.isDarkMode ? "dark" : ""
        }`}
      >
        <div>
          <Router>
            <MainTitle
              toggleIsDBResultPopupOpen={toggleIsDBResultPopupOpen}
              toggleIsSettingPopupOpen={toggleIsSettingPopupOpen}
            />
            <Popup
              open={isSettingPopupOpen}
              closeOnDocumentClick
              onClose={() => toggleIsSettingPopupOpen(false)}
            >
              <SettingsPopup
                setLocalStorageValue={setLocalStorageValue}
                handleClose={toggleIsSettingPopupOpen}
              />
            </Popup>
            <Popup
              open={isDBResultPopupOpen}
              closeOnDocumentClick
              onClose={() => toggleIsDBResultPopupOpen(false)}
            >
              <DBResultPopup handleClose={toggleIsDBResultPopupOpen} />
            </Popup>
            <section
              className="links-section"
              style={
                essentialData.pathName === "read-mode"
                  ? { display: "none" }
                  : {}
              }
            >
              <div></div>
              <ul>
                <li>
                  <Link
                    className={essentialData.pathName === "" ? "active" : ""}
                    to="/"
                  >
                    儀表板
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      essentialData.pathName === "abstract" ? "active" : ""
                    }
                    to="/abstract"
                  >
                    摘要&技術
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      essentialData.pathName === "disclosure" ? "active" : ""
                    }
                    to="/disclosure"
                  >
                    {essentialData.applicationNum === ""
                      ? "發明/新型"
                      : essentialData.applicationNum[3] === "1"
                      ? "發明"
                      : "新型"}
                    內容
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      essentialData.pathName === "mode-for-invention"
                        ? "active"
                        : ""
                    }
                    to="/mode-for-invention"
                  >
                    實施方式
                  </Link>
                </li>
                <li>
                  <Link
                    className={
                      essentialData.pathName === "claim" ? "active" : ""
                    }
                    to="/claim"
                  >
                    申請專利範圍
                  </Link>
                </li>
              </ul>
              <div className="analysis-result">
                {process.env.REACT_APP_SYSTEM_TYPE === "tipo" && (
                  <span>
                    <Link to="/result">分析結果</Link>
                  </span>
                )}
              </div>
            </section>
            <div
              className="main-body"
              style={
                essentialData.pathName === "read-mode"
                  ? { paddingBottom: 0 }
                  : {}
              }
            >
              <Switch>
                <Route exact path="/" component={Dashboard} />
                <Route path="/abstract" component={Abstract} />
                <Route
                  path="/disclosure"
                  render={() => <Disclosure handleReInit={handleReInit} />}
                />
                <Route
                  path="/mode-for-invention"
                  render={() => (
                    <ModeForInvention handleReInit={handleReInit} />
                  )}
                />
                <Route
                  path="/claim"
                  render={() => <Claims handleReInit={handleReInit} />}
                />
                <Route path="/readme" render={() => <Readme />} />
                <Route path="/result" render={() => <Result />} />
                <Route path="/read-mode" render={() => <ReadeMode />} />
              </Switch>
            </div>
          </Router>
        </div>
      </main>
    </div>
  );
}

const ReadeMode = () => {
  const [essentialData, setEssentialData] = useContext(
    EssentialDataContextProvider
  );

  useEffect(() => {
    setEssentialData((prev) => ({ ...prev, pathName: getPathName() }));
  }, []);

  return (
    <div className="main-body-grid">
      <div className="main-body-grid-item ">
        <SimpleDescription />
      </div>
      <div className="main-body-grid-item ">
        <SimpleClaims />
      </div>
    </div>
  );
};

import React, { useContext } from "react";
import { EssentialDataContextProvider } from "../contexts/EssentialDataContext";
import SettingImg from "../assets/setting.png";
import { Link, useHistory } from "react-router-dom";

function MainTitle({ toggleIsDBResultPopupOpen, toggleIsSettingPopupOpen }) {
  const [essentialData, setEssentialData] = useContext(
    EssentialDataContextProvider
  );
  const history = useHistory();

  const handleGoBack = (e) => {
    e.preventDefault();
    history.goBack();
  };

  return (
    <h1 id="main-title">
      <span
        style={
          essentialData.pathName === "read-mode" ? { display: "none" } : {}
        }
      >
        {" "}
        <Link to="/readme">
          使用
          <br />
          指南
        </Link>
      </span>
      {essentialData.pathName === "read-mode" ? (
        <>
          <span>
            <a onClick={handleGoBack}>
              返{"    "}回
              <br />
              標準模式
            </a>
          </span>
          <i
            onClick={() =>
              setEssentialData((prev) => ({
                ...prev,
                personalSettings: {
                  ...essentialData.personalSettings,
                  readingModePureText:
                    !essentialData.personalSettings.readingModePureText,
                },
              }))
            }
          >
            {essentialData.personalSettings.readingModePureText
              ? "互動式"
              : "純文字"}
            <br />
            閱讀
          </i>
        </>
      ) : (
        <span>
          <Link to="/read-mode">
            閱讀
            <br />
            模式
          </Link>
        </span>
      )}
      <img
        onClick={() => toggleIsSettingPopupOpen(true)}
        className="setting-icon"
        src={SettingImg}
        alt=""
      />
      {essentialData.dbResultMap &&
        Object.keys(essentialData.dbResultMap).length > 0 && (
          <i
            className="db-result"
            onClick={() => toggleIsDBResultPopupOpen(true)}
          >
            資料庫
            <br />
            搜尋結果
          </i>
        )}
      {process.env.REACT_APP_SYSTEM_TYPE === "tipo"
        ? "自動化專利審查系統"
        : "專利申請文件輔助偵錯系統"}
    </h1>
  );
}

export default MainTitle;

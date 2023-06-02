import React, { useContext, useEffect, useState } from "react";
import { EssentialDataContextProvider } from "../contexts/EssentialDataContext";
import { getPathName } from "../utils/getPathName";
import ToggleDisp from "../components/ToggleDisp";

const Result = () => {
  const [essentialData, setEssentialData] = useContext(
    EssentialDataContextProvider
  );
  const [resultContent, setResultContent] = useState(undefined);
  const [isCopying, toggleIsCopying] = useState({
    system_fail: false,
    no_law: false,
    law_104: false,
    law_112_3: false,
    law_112_5: false,
  });

  useEffect(() => {
    setEssentialData((prev) => ({
      ...prev,
      pathName: getPathName(),
    }));
  }, []);

  const handleCopy = (e) => {
    let lawGroupEl = e.target;
    while (!lawGroupEl.className.includes("law-group"))
      lawGroupEl = lawGroupEl.parentElement;
    // console.log(lawGroupEl);
    const copyContent = [];
    for (let labelEl of lawGroupEl.querySelectorAll("label")) {
      if (labelEl.querySelector("input[type=checkbox]:checked")) {
        copyContent.push(labelEl.textContent);
      }
    }
    //navigator.clipboard.writeText(copyContent.join("\n"));

    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(copyContent.join("\n"));
    } else {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement("textarea");
      textArea.value = copyContent.join("\n");

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }
  };

  /*
            system_fail: [],
          no_law: [],
          law_104: [],
          law_112_3: [],
          law_112_5: [],
          structuredResult: {},
  */

  useEffect(() => {
    if (
      !essentialData.isProcessing &&
      essentialData.abstractContent.length !== 0
    ) {
      if (
        essentialData.resultDispType === "old" &&
        (essentialData.allErrors.title.length !== 0 ||
          essentialData.allErrors.descriptionOfElementMap.length !== 0 ||
          essentialData.allErrors.figureOfDrawingsMap.length !== 0 ||
          essentialData.allErrors.allDisclosureParagraphDetails.length !== 0 ||
          essentialData.allErrors.allModeForInventionParagraphDetails.length !==
            0 ||
          essentialData.allErrors.allClaimsDetails.length !== 0 ||
          essentialData.allErrors.system.length !== 0)
      ) {
        setResultContent(
          <div>
            <strong
              style={{
                display: "block",
                textAlign: "center",
                marginBottom: 10,
                fontSize: "1.2em",
                fontWeight: 700,
                color: "red",
              }}
            >
              &#9888;本分析結果僅供參考，審查官引用時應再次確認每項所對應的內容是否正確
            </strong>
            {/** title */}
            {essentialData.allErrors.title.length !== 0 && (
              <>
                <p className="p-title">【新型名稱】</p>
                {essentialData.allErrors.title.map(({ message }, idx) => (
                  <p
                    key={idx}
                    className="result-content-paragraph"
                    data-idx={idx + 1}
                  >
                    {message}
                  </p>
                ))}
              </>
            )}

            {/** descriptionOfElementMap */}
            {essentialData.allErrors.descriptionOfElementMap.length !== 0 && (
              <>
                <p className="p-title">【符號說明】</p>
                {essentialData.allErrors.descriptionOfElementMap.map(
                  ({ message }, idx) => (
                    <p
                      key={idx}
                      className="result-content-paragraph"
                      data-idx={idx + 1}
                    >
                      {message}
                    </p>
                  )
                )}
              </>
            )}
            {/** figureOfDrawingsMap */}
            {essentialData.allErrors.figureOfDrawingsMap.length !== 0 && (
              <>
                <p className="p-title">【代表圖之符號簡單說明】</p>
                {essentialData.allErrors.figureOfDrawingsMap.map(
                  ({ message }, idx) => (
                    <p
                      key={idx}
                      className="result-content-paragraph"
                      data-idx={idx + 1}
                    >
                      {message}
                    </p>
                  )
                )}
              </>
            )}
            {/** allDisclosureParagraphDetails */}
            {essentialData.allErrors.allDisclosureParagraphDetails.length !==
              0 && (
              <>
                <p className="p-title">【新型內容】</p>
                {essentialData.allErrors.allDisclosureParagraphDetails.map(
                  ({ message }, idx) => (
                    <p
                      key={idx}
                      className="result-content-paragraph"
                      data-idx={idx + 1}
                    >
                      {message}
                    </p>
                  )
                )}
              </>
            )}
            {/** allModeForInventionParagraphDetails */}
            {essentialData.allErrors.allModeForInventionParagraphDetails
              .length !== 0 && (
              <>
                <p className="p-title">【實施方式】</p>
                {essentialData.allErrors.allModeForInventionParagraphDetails.map(
                  ({ message }, idx) => (
                    <p
                      key={idx}
                      className="result-content-paragraph"
                      data-idx={idx + 1}
                    >
                      {message}
                    </p>
                  )
                )}
              </>
            )}
            {/** allClaimsDetails */}
            {essentialData.allErrors.allClaimsDetails.length !== 0 && (
              <>
                <p className="p-title">【申請專利範圍】</p>
                {essentialData.allErrors.allClaimsDetails.map(
                  ({ message }, idx) => (
                    <p
                      key={idx}
                      className="result-content-paragraph"
                      data-idx={idx + 1}
                    >
                      {message}
                    </p>
                  )
                )}
              </>
            )}
            {/** system */}
            {essentialData.allErrors.system.length !== 0 && (
              <>
                <p className="p-title">【系統無法判別之錯誤】</p>
                {essentialData.allErrors.system.map(({ message }, idx) => (
                  <p
                    key={idx}
                    className="result-content-paragraph"
                    data-idx={idx + 1}
                  >
                    {message}
                  </p>
                ))}
              </>
            )}
          </div>
        );
      } else if (
        essentialData.resultDispType === "new" &&
        (essentialData.allErrors_v2.structuredResult.system_fail.length > 0 ||
          essentialData.allErrors_v2.structuredResult.no_law.length > 0 ||
          essentialData.allErrors_v2.structuredResult.law_104.length > 0 ||
          essentialData.allErrors_v2.structuredResult.law_112_3.children
            .length > 0 ||
          essentialData.allErrors_v2.structuredResult.law_112_5.children
            .length > 0)
      ) {
        setResultContent(
          <div>
            <strong
              style={{
                display: "block",
                textAlign: "center",
                marginBottom: 10,
                fontSize: "1.2em",
                fontWeight: 700,
                color: "red",
              }}
            >
              &#9888;本分析結果僅供參考，審查官引用時應再次確認每項所對應的內容是否正確
            </strong>
            {essentialData.allErrors_v2.structuredResult.law_104.length > 0 && (
              <div className="law-group">
                <h4 className="result-v2-title">
                  專利法第104條
                  {isCopying.law_104 ? (
                    <div className="result-v2-title-btns">
                      <button className="with-active" onClick={handleCopy}>
                        確定
                      </button>
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            law_104: false,
                          }))
                        }
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="result-v2-title-btns">
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            law_104: true,
                          }))
                        }
                      >
                        複製內容
                      </button>
                    </div>
                  )}
                </h4>
                <ul className="result-v2-ul">
                  {essentialData.allErrors_v2.structuredResult.law_104.map(
                    (message, idx) => (
                      <li className="result-v2-li" key={idx}>
                        <ToggleDisp
                          isSelecting={isCopying.law_104}
                          icon={
                            essentialData.allErrors_v2.structuredResult.law_104
                              .length === 1
                              ? ""
                              : idx + 1
                          }
                        >
                          {message}
                        </ToggleDisp>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {essentialData.allErrors_v2.structuredResult.law_112_3.children
              .length > 0 && (
              <div className="law-group">
                <h4 className="result-v2-title">
                  專利法第112條第3款{" "}
                  {isCopying.law_112_3 ? (
                    <div className="result-v2-title-btns">
                      <button className="with-active" onClick={handleCopy}>
                        確定
                      </button>
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            law_112_3: false,
                          }))
                        }
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="result-v2-title-btns">
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            law_112_3: true,
                          }))
                        }
                      >
                        複製內容
                      </button>
                    </div>
                  )}
                </h4>
                {essentialData.allErrors_v2.structuredResult.law_112_3.children
                  .length === 1 &&
                essentialData.allErrors_v2.structuredResult.law_112_3
                  .children[0].children.length === 1 ? (
                  <div className="result-v2-only-child">
                    <ToggleDisp isSelecting={isCopying.law_112_3}>
                      <span className="bg-green">
                        {
                          essentialData.allErrors_v2.structuredResult.law_112_3
                            .children[0].prefix
                        }
                      </span>
                      <span className="bg-blue">
                        {
                          essentialData.allErrors_v2.structuredResult.law_112_3
                            .children[0].children[0]
                        }
                      </span>
                      <span>
                        {
                          essentialData.allErrors_v2.structuredResult.law_112_3
                            .lawBodyEnd
                        }
                      </span>
                    </ToggleDisp>
                  </div>
                ) : (
                  <>
                    <div className="result-v2-lawbody">
                      <ToggleDisp isSelecting={isCopying.law_112_3} icon="◎">
                        <span>
                          {
                            essentialData.allErrors_v2.structuredResult
                              .law_112_3.lawBody
                          }
                        </span>
                      </ToggleDisp>
                    </div>
                    {essentialData.allErrors_v2.structuredResult.law_112_3.children.map(
                      ({ prefix, children }, cIdx) => (
                        <React.Fragment key={cIdx}>
                          {prefix && (
                            <div className="result-v2-prefix">
                              <ToggleDisp
                                isSelecting={isCopying.law_112_3}
                                icon="&#9724;"
                                iconColor="green"
                              >
                                <span className="bg-green">{prefix}</span>
                              </ToggleDisp>
                            </div>
                          )}
                          {children.map((message, mIdx) => (
                            <div
                              key={mIdx}
                              style={{ paddingInline: "20px 8px" }}
                            >
                              <ToggleDisp
                                isSelecting={isCopying.law_112_3}
                                icon="&#9724;"
                                iconColor="blue"
                                iconStyle={{ transform: "rotate(45deg)" }}
                              >
                                <span className="bg-blue">{message}</span>
                              </ToggleDisp>
                            </div>
                          ))}
                        </React.Fragment>
                      )
                    )}
                  </>
                )}
              </div>
            )}
            {essentialData.allErrors_v2.structuredResult.law_112_5.children
              .length > 0 && (
              <div className="law-group">
                <h4 className="result-v2-title">
                  專利法第112條第5款
                  {isCopying.law_112_5 ? (
                    <div className="result-v2-title-btns">
                      <button className="with-active" onClick={handleCopy}>
                        確定
                      </button>
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            law_112_5: false,
                          }))
                        }
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="result-v2-title-btns">
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            law_112_5: true,
                          }))
                        }
                      >
                        複製內容
                      </button>
                    </div>
                  )}
                </h4>
                {essentialData.allErrors_v2.structuredResult.law_112_5.children
                  .length === 1 &&
                essentialData.allErrors_v2.structuredResult.law_112_5
                  .children[0].children.length === 1 ? (
                  <div className="result-v2-only-child">
                    <ToggleDisp isSelecting={isCopying.law_112_5}>
                      <span className="bg-green">
                        {
                          essentialData.allErrors_v2.structuredResult.law_112_5
                            .children[0].prefix
                        }
                      </span>
                      <span className="bg-blue">
                        {
                          essentialData.allErrors_v2.structuredResult.law_112_5
                            .children[0].children[0]
                        }
                      </span>
                      <span>
                        {
                          essentialData.allErrors_v2.structuredResult.law_112_5
                            .lawBodyEnd
                        }
                      </span>
                    </ToggleDisp>
                  </div>
                ) : (
                  <>
                    <div className="result-v2-lawbody">
                      <ToggleDisp isSelecting={isCopying.law_112_5} icon="◎">
                        <span>
                          {
                            essentialData.allErrors_v2.structuredResult
                              .law_112_5.lawBody
                          }
                        </span>
                      </ToggleDisp>
                    </div>
                    {essentialData.allErrors_v2.structuredResult.law_112_5.children.map(
                      ({ prefix, children }, cIdx) => (
                        <React.Fragment key={cIdx}>
                          {prefix && (
                            <div className="result-v2-prefix">
                              <ToggleDisp
                                isSelecting={isCopying.law_112_5}
                                icon="&#9632;"
                                iconColor="green"
                              >
                                <span className="bg-green">{prefix}</span>
                              </ToggleDisp>
                            </div>
                          )}
                          {children.map((message, mIdx) => (
                            <div
                              key={mIdx}
                              style={{ paddingInline: "20px 8px" }}
                            >
                              <ToggleDisp
                                isSelecting={isCopying.law_112_5}
                                icon="&#9724;"
                                iconColor="blue"
                                iconStyle={{ transform: "rotate(45deg)" }}
                              >
                                <span className="bg-blue">{message}</span>
                              </ToggleDisp>
                            </div>
                          ))}
                        </React.Fragment>
                      )
                    )}
                  </>
                )}
              </div>
            )}
            {essentialData.allErrors_v2.structuredResult.no_law.length > 0 && (
              <div className="law-group">
                <h4 className="result-v2-title">
                  未帶法條（其他）
                  {isCopying.no_law ? (
                    <div className="result-v2-title-btns">
                      <button className="with-active" onClick={handleCopy}>
                        確定
                      </button>
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            no_law: false,
                          }))
                        }
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="result-v2-title-btns">
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            no_law: true,
                          }))
                        }
                      >
                        複製內容
                      </button>
                    </div>
                  )}
                </h4>
                <ul className="result-v2-ul">
                  {essentialData.allErrors_v2.structuredResult.no_law.map(
                    (message, idx) => (
                      <li className="result-v2-li" key={idx}>
                        <ToggleDisp
                          isSelecting={isCopying.no_law}
                          icon={
                            essentialData.allErrors_v2.structuredResult.no_law
                              .length === 1
                              ? ""
                              : idx + 1
                          }
                        >
                          {message}
                        </ToggleDisp>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
            {essentialData.allErrors_v2.structuredResult.system_fail.length >
              0 && (
              <div className="law-group">
                <h4 className="result-v2-title">
                  系統無法判別之錯誤
                  {isCopying.system_fail ? (
                    <div className="result-v2-title-btns">
                      <button className="with-active" onClick={handleCopy}>
                        確定
                      </button>
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            system_fail: false,
                          }))
                        }
                      >
                        取消
                      </button>
                    </div>
                  ) : (
                    <div className="result-v2-title-btns">
                      <button
                        onClick={() =>
                          toggleIsCopying((prev) => ({
                            ...prev,
                            system_fail: true,
                          }))
                        }
                      >
                        複製內容
                      </button>
                    </div>
                  )}
                </h4>
                <ul className="result-v2-ul">
                  {essentialData.allErrors_v2.structuredResult.system_fail.map(
                    (message, idx) => (
                      <li className="result-v2-li" key={idx}>
                        <ToggleDisp
                          isSelecting={isCopying.system_fail}
                          icon={
                            essentialData.allErrors_v2.structuredResult
                              .system_fail.length === 1
                              ? ""
                              : idx + 1
                          }
                        >
                          {message}
                        </ToggleDisp>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        );
      } else {
        setResultContent(
          <div>
            <h3>本案未檢查到任何錯誤</h3>
          </div>
        );
      }
    }
  }, [essentialData, isCopying]);

  return (
    <>
      <section className="title-section">
        <h1>分析結果</h1>
      </section>
      {!essentialData.isProcessing &&
        essentialData.abstractContent.length !== 0 && (
          <div className="title-btns">
            <button
              className={essentialData.resultDispType === "new" ? "active" : ""}
              onClick={() => {
                if (essentialData.resultDispType === "old")
                  setEssentialData((prev) => ({
                    ...prev,
                    resultDispType: "new",
                  }));
              }}
            >
              新版
            </button>
            <button
              className={essentialData.resultDispType === "old" ? "active" : ""}
              onClick={() => {
                if (essentialData.resultDispType === "new")
                  setEssentialData((prev) => ({
                    ...prev,
                    resultDispType: "old",
                  }));
              }}
            >
              舊版
            </button>
          </div>
        )}
      <section className="result-content">
        {!resultContent && (
          <h3>
            {essentialData.isProcessing
              ? "Processing..."
              : "No data passed in yet."}
          </h3>
        )}
        {resultContent}
      </section>
    </>
  );
};

export default Result;

/*
    <>
      <h1>分析結果</h1>
      <section className="result-content">
        <div>
          <p>【符號說明】</p>
          <p className="result-content-paragraph" data-idx="1">
            依專利法施行細則第45條準用第22條第1項之規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案「說明書」內容之記載未依前開規定之格式撰寫（段落編號【　】第　、　行
            ／ 第　頁第　、　行之構件「　（　）」，與「符號說明」 ／
            及「代表圖之符號簡單說明」所述之構件「　（　）」，其名稱用語 ／
            符號不一致），應予修正。查違反專利法第120條準用第26條第4項之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】
          </p>
          <p>【申請專利範圍】</p>
          <p className="result-content-paragraph" data-idx="1">
            依專利法施行細則第45條準用第18條第6項之規定：「獨立項或附屬項之文字敘述，應以單句為之。」本案「申請專利範圍」第　項內容之記載未依前開規定之格式撰寫（文字敘述未以單句為之
            ／
            ，於句中出現句點為不當之處），應予修正。查違反專利法第120條準用第26條第4項之規定。
          </p>
          <p className="result-content-paragraph" data-idx="2">
            依專利法施行細則第45條準用第18條第1項之規定：「…。獨立項、附屬項，應以其依附關係，依序以阿拉伯數字編號排列。」本案「申請專利範圍」第　項內容之記載未依前開規定之格式撰寫（該項第　行所述之技術特徵「　」，於所依附申請專利範圍第　項中未揭示此技術特徵，係不當依附），應予修正。查違反專利法第120條準用第26條第4項之規定。【摘要、說明書其餘部分請一併確認及修正】
          </p>
        </div>
      </section>
    </>
*/

/*
  useEffect(() => {
    if (
      !essentialData.isProcessing &&
      essentialData.abstractContent.length !== 0
    ) {
      let htmlContent = "";

      // title
      if (essentialData.allErrors.title.length !== 0) {
        htmlContent += `<p class="p-title">【新型名稱】</p>`;
        htmlContent += essentialData.allErrors.title
          .map(
            ({ message }, idx) =>
              `<p class="result-content-paragraph" data-idx="${
                idx + 1
              }">${message}</p>`
          )
          .join("");
      }

      // descriptionOfElementMap
      if (essentialData.allErrors.descriptionOfElementMap.length !== 0) {
        htmlContent += `<p class="p-title">【符號說明】</p>`;
        htmlContent += essentialData.allErrors.descriptionOfElementMap
          .map(
            ({ message }, idx) =>
              `<p class="result-content-paragraph" data-idx="${
                idx + 1
              }">${message}</p>`
          )
          .join("");
      }

      // figureOfDrawingsMap
      if (essentialData.allErrors.figureOfDrawingsMap.length !== 0) {
        htmlContent += `<p class="p-title">【代表圖之符號簡單說明】</p>`;
        htmlContent += essentialData.allErrors.figureOfDrawingsMap
          .map(
            ({ message }, idx) =>
              `<p class="result-content-paragraph" data-idx="${
                idx + 1
              }">${message}</p>`
          )
          .join("");
      }

      // allDisclosureParagraphDetails
      if (essentialData.allErrors.allDisclosureParagraphDetails.length !== 0) {
        htmlContent += `<p class="p-title">【新型內容】</p>`;
        htmlContent += essentialData.allErrors.allDisclosureParagraphDetails
          .map(
            ({ message }, idx) =>
              `<p class="result-content-paragraph" data-idx="${
                idx + 1
              }">${message}</p>`
          )
          .join("");
      }

      // allModeForInventionParagraphDetails
      if (
        essentialData.allErrors.allModeForInventionParagraphDetails.length !== 0
      ) {
        htmlContent += `<p class="p-title">【實施方式】</p>`;
        htmlContent +=
          essentialData.allErrors.allModeForInventionParagraphDetails
            .map(
              ({ message }, idx) =>
                `<p class="result-content-paragraph" data-idx="${
                  idx + 1
                }">${message}</p>`
            )
            .join("");
      }

      // allClaimsDetails
      if (essentialData.allErrors.allClaimsDetails.length !== 0) {
        htmlContent += `<p class="p-title">【申請專利範圍】</p>`;
        htmlContent += essentialData.allErrors.allClaimsDetails
          .map(
            ({ message }, idx) =>
              `<p class="result-content-paragraph" data-idx="${
                idx + 1
              }">${message}</p>`
          )
          .join("");
      }

      // system
      if (essentialData.allErrors.system.length !== 0) {
        htmlContent += `<p class="p-title">【系統無法判別之錯誤】</p>`;
        htmlContent += essentialData.allErrors.system
          .map(
            ({ message }, idx) =>
              `<p class="result-content-paragraph" data-idx="${
                idx + 1
              }">${message}</p>`
          )
          .join("");
      }

      if (htmlContent) {
        resultContentRef.current.innerHTML =
          "<div>" +
          `<strong style="
              display: block; 
              text-align: center; 
              margin-bottom: 10px;
              font-size: 1.2em;
              font-weight: 700;
              color: red;
          ">&#9888;本分析結果僅供參考，審查官引用時應再次確認每項所對應的內容是否正確</strong>` +
          htmlContent +
          "</div>";
      } else {
        resultContentRef.current.innerHTML = `<div><h3>本案未檢查到任何錯誤</h3></div>`;
      }
    }
  }, [essentialData]);
*/

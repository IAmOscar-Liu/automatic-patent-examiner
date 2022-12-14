import React, { useEffect, useContext, useCallback, useState } from "react";
import { EssentialDataContextProvider } from "../contexts/EssentialDataContext";
import { XMLContextProvider } from "../contexts/XMLContext";
import { UpdateParagraphContextProvider } from "../contexts/UpdateParagraphContext";
import { getPathName } from "../utils/getPathName";
import Dropzone from "react-dropzone";
import { fullCharToHalf } from "../utils/fullCharToHalf";

const Dashboard = () => {
  const [essentialData, setEssentialData] = useContext(
    EssentialDataContextProvider
  );
  const [XMLData, setXMLData] = useContext(XMLContextProvider);
  const { savedFileContent, setSavedFileContent } = useContext(
    UpdateParagraphContextProvider
  );
  const [isDragOver, setIsDragOver] = useState(false);
  // const [isInEditingMode, setIsInEditingMode] = useState(false);
  // const [textAreaValue, setTextAreaValue] = useState(() => {
  //   if (savedFileContent !== "") {
  //     return savedFileContent;
  //   }
  //   try {
  //     return XMLData.fileContent ? XMLData.fileContent.toString() : "";
  //   } catch (error) {
  //     return "";
  //   }
  // });
  // setSavedFileContent(() => {
  //   if (savedFileContent !== "") {
  //     return savedFileContent;
  //   }
  //   try {
  //     return XMLData.fileContent ? XMLData.fileContent.toString() : "";
  //   } catch (error) {
  //     return "";
  //   }
  // });

  const dragAreaMsg = essentialData.dragAreaMsg;
  const setDragAreaMsg = (msg) => {
    setEssentialData((prev) => ({ ...prev, dragAreaMsg: msg }));
  };

  const handleFileChange = (fileName, fileContent) => {
    // handle the file...
    const newFileName = Math.random().toString().slice(2, 8) + fileName;

    setXMLData((prev) => ({
      ...prev,
      isLoading: true,
      fileName: newFileName,
      fileContent
    }));
  };

  useEffect(() => {
    setEssentialData((prev) => ({
      ...prev,
      pathName: getPathName()
    }));
  }, []);

  useEffect(() => {
    let newTextAreaValue;
    try {
      newTextAreaValue = XMLData.fileContent
        ? XMLData.fileContent.toString()
        : "";
    } catch (error) {
      newTextAreaValue = "";
    }
    setSavedFileContent((prev) => ({
      ...prev,
      content: newTextAreaValue,
      textAreaValue: newTextAreaValue
    }));
  }, [XMLData.fileContent]);

  const handleOnDrop = useCallback((acceptedFiles) => {
    setIsDragOver(false);

    if (!acceptedFiles) {
      return;
    }
    const file = acceptedFiles[0];
    const fileName = file.name;
    const msg = `??????????????????${fileName}???????????????????????????XML???????????????????????????`;
    try {
      if (!/.xml$/.test(fileName)) {
        const fileNotXmlErrMsg = `??????${fileName}??????XML???????????????XML??????`;
        setDragAreaMsg(fileNotXmlErrMsg);
        window.alert(fileNotXmlErrMsg);
        return;
      }

      const reader = new FileReader();

      reader.onabort = () => {
        setDragAreaMsg(msg);
        window.alert(msg);
      };
      reader.onerror = () => {
        setDragAreaMsg(msg);
        window.alert(msg);
      };
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        // convert 0-9 a-z A-Z from full to half
        const convertFullToHalf = fullCharToHalf(binaryStr);
        handleFileChange(file.name, convertFullToHalf);
      };
      reader.readAsText(file, "utf8");
    } catch (error) {
      setDragAreaMsg(msg);
      window.alert(msg);
    }
  }, []);

  return (
    <>
      <section className="title-section">
        <h1>?????????</h1>
      </section>
      <section className="dashboard-section">
        <div className="dashboard-section-btns">
          <button
            className={savedFileContent.isInEditingMode ? "active" : ""}
            onClick={() =>
              setSavedFileContent((prev) => ({
                ...prev,
                isInEditingMode: true
              }))
            }
          >
            ??????XML??????
          </button>
          <button
            className={savedFileContent.isInEditingMode ? "" : "active"}
            onClick={() =>
              setSavedFileContent((prev) => ({
                ...prev,
                isInEditingMode: false
              }))
            }
          >
            ??????XML??????
          </button>
        </div>
        {savedFileContent.isInEditingMode ? (
          <>
            {XMLData.fileName !== "" &&
              !essentialData.isProcessing &&
              essentialData.missingData.length > 0 &&
              /??????????????????????????????????????????$/.test(dragAreaMsg) && (
                <div className="edit-zone-error">
                  <p>??????XML????????????????????????:</p>
                  <ul style={{ paddingLeft: "1.8em" }}>
                    {essentialData.missingData.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                  <p style={{ marginTop: ".3em" }}>
                    ?????????????????????????????????????????????????????????????????????
                  </p>
                </div>
              )}
            {/^???XML??????????????????????????????|??????XML???????????????XML??????$|??????XML???????????????XML??????$/.test(
              dragAreaMsg
            ) && (
              <div className="edit-zone-error">
                <p>{dragAreaMsg}</p>
              </div>
            )}
            {/????????????????????????????????????????????????????????????$/.test(dragAreaMsg) && (
              <div className="edit-zone-ok">
                <p>{`????????????${XMLData.fileName.slice(
                  6
                )}???????????????????????????????????????????????????????????????`}</p>
              </div>
            )}
            <div className="edit-zone">
              <textarea
                required
                placeholder="??????????????????XML??????"
                value={savedFileContent.textAreaValue}
                onChange={(e) =>
                  setSavedFileContent((prev) => ({
                    ...prev,
                    textAreaValue: e.target.value
                  }))
                }
              ></textarea>
            </div>
            <div className="dashboard-section-btns-bottom">
              <button
                disabled={
                  savedFileContent.textAreaValue.length === 0 ? true : ""
                }
                onClick={() => {
                  setSavedFileContent((prev) => ({
                    ...prev,
                    content: prev.textAreaValue
                  }));
                  handleFileChange(
                    "untitle.xml",
                    fullCharToHalf(savedFileContent.textAreaValue)
                  );
                }}
              >
                ??????
              </button>
              {savedFileContent.textAreaValue !== savedFileContent.content && (
                <button
                  onClick={() =>
                    setSavedFileContent((prev) => ({
                      ...prev,
                      textAreaValue: prev.content
                    }))
                  }
                >
                  ??????
                </button>
              )}
              <button
                onClick={() =>
                  setSavedFileContent((prev) => ({
                    ...prev,
                    textAreaValue: ""
                  }))
                }
              >
                ??????
              </button>
            </div>
          </>
        ) : (
          <div className="drag-zone">
            <Dropzone
              onDrop={handleOnDrop}
              onDragEnter={() => setIsDragOver(true)}
              onDragLeave={() => setIsDragOver(false)}
            >
              {({ getRootProps, getInputProps }) => (
                <section
                  className={`drag-zone-section ${
                    isDragOver ? "dragover" : ""
                  }`}
                  style={
                    !isDragOver &&
                    /????????????????????????????????????????????????????????????$/.test(
                      dragAreaMsg
                    )
                      ? { backgroundColor: "lightgreen" }
                      : !isDragOver &&
                        /^???XML??????????????????????????????|??????XML???????????????XML??????$|??????XML???????????????XML??????$|??????????????????????????????????????????$/.test(
                          dragAreaMsg
                        )
                      ? { backgroundColor: "rgba(255,0,0,.7)" }
                      : {}
                  }
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div>
                    {XMLData.fileName !== "" &&
                      !essentialData.isProcessing &&
                      essentialData.missingData.length > 0 &&
                      /??????????????????????????????????????????$/.test(dragAreaMsg) && (
                        <div style={{ marginBottom: "1em", fontSize: "1.2em" }}>
                          <p style={{ lineHeight: 1.6 }}>
                            ??????XML?????????????????????:
                          </p>
                          <ul style={{ paddingLeft: "1.8em" }}>
                            {essentialData.missingData.map((d) => (
                              <li key={d}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    <p>{dragAreaMsg}</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
        )}
        {!savedFileContent.isInEditingMode &&
          /????????????????????????????????????????????????????????????$/.test(dragAreaMsg) && (
            <button
              onClick={() =>
                handleFileChange(XMLData.fileName.slice(6), XMLData.fileContent)
              }
            >
              ????????????
            </button>
          )}
      </section>
    </>
  );
};

export default Dashboard;

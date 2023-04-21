import React, { useRef, useState, useEffect, useContext } from "react";
import checkedImg from "../assets/checked.png";
import warningImg from "../assets/warn.png";
import errorImg from "../assets/error.png";
import aboriginalImg from "../assets/aboriginal.png";
import { EssentialDataContextProvider } from "../contexts/EssentialDataContext";
import {
  triggerToggleAboriginalWordBtnColor,
  triggerToggleBtnColor,
  triggerToggleErrorBtnColor,
  triggerToggleFigureBtnColor,
  triggerTogglePotentialErrorBtnColor,
  triggerToggleWrongFigureBtnColor,
  triggerToggleWrongWordBtnColor
} from "../utils/trigger/paragraph";

const highlightButtonStyle = {
  background: "rgb(182, 100, 71)",
  color: "rgb(238, 238, 238)",
  border: "none",
  outline: "none",
  cursor: "pointer",
  fontSize: "0.9em",
  padding: "2px 0.3em",
  borderRadius: "0.4em",
  margin: "0 1.5vw 0 auto",
  alignSelf: "center",
  whiteSpace: "nowrap"
};

const SingleParagraphSimple = ({
  index,
  dataType,
  applicationNum,
  general,
  content,
  modifiedParagraph,
  figureKeys,
  wrongFigureKeys,
  correctKeys,
  wrongKeys,
  potentialWrongKeys,
  wrongWordKeys,
  aboriginalWordKeys,
  elementColorMap,
  isCollapse,
  setIsCollapse,
  searchString,
  globalHighlightOn,
  globalHighlightElement
}) => {
  const divRef = useRef(null);
  const searchStringPrev = useRef(searchString);
  const [numOfFoundedStr, setNumOfFoundedStr] = useState(0);
  const [myReduceFigureKeys, setMyReduceFigureKeys] = useState({});
  const [myReduceWrongFigureKeys, setMyReduceWrongFigureKeys] = useState({});
  const [myReduceCorrectKeys, setMyReduceCorrectKeys] = useState({});
  const [myReduceWrongKeys, setMyReduceWrongKeys] = useState({});
  const [myReducePotentialWrongKeys, setMyReducePotentialWrongKeys] = useState(
    {}
  );
  const [myReduceWrongWordKeys, setMyReduceWrongWordKeys] = useState({});
  const [myReduceAboriginalWordKeys, setMyReduceAboriginalWordKeys] = useState(
    {}
  );

  const [essentialData, setEssentialData] = useContext(
    EssentialDataContextProvider
  );

  const toggleBtnColor = (key) => {
    if (essentialData.personalSettings.synchronizeHighlight) {
      const prevGlobalHighlightElement = [
        ...essentialData.globalHighlightElement
      ];

      if (prevGlobalHighlightElement.find((el) => el === key)) {
        setEssentialData((prev) => ({
          ...prev,
          globalHighlightOn: prevGlobalHighlightElement.length !== 1,
          globalHighlightElement: prevGlobalHighlightElement.filter(
            (g) => g !== key
          )
        }));
      } else {
        setEssentialData((prev) => ({
          ...prev,
          globalHighlightOn: true,
          globalHighlightElement: [...prevGlobalHighlightElement, key]
        }));
      }
    } else {
      divRef.current.querySelectorAll(`.c-${key}`).forEach((el) => {
        el.style.background = myReduceCorrectKeys[key].clicked
          ? "inherit"
          : elementColorMap[key].color;
      });

      setMyReduceCorrectKeys({
        ...myReduceCorrectKeys,
        [key]: {
          ...myReduceCorrectKeys[key],
          clicked: !myReduceCorrectKeys[key].clicked
        }
      });
    }
  };

  const toggleErrorBtnColor = (key) => {
    divRef.current.querySelectorAll(`.e-${key}`).forEach((el) => {
      el.style.background = myReduceWrongKeys[key].clicked ? "inherit" : "red";
    });

    setMyReduceWrongKeys({
      ...myReduceWrongKeys,
      [key]: {
        ...myReduceWrongKeys[key],
        clicked: !myReduceWrongKeys[key].clicked
      }
    });
  };

  const toggleWrongWordBtnColor = (key) => {
    divRef.current.querySelectorAll(`.ew-${key}`).forEach((el) => {
      el.style.background = myReduceWrongWordKeys[key].clicked
        ? "inherit"
        : "red";
    });

    setMyReduceWrongWordKeys({
      ...myReduceWrongWordKeys,
      [key]: {
        ...myReduceWrongWordKeys[key],
        clicked: !myReduceWrongWordKeys[key].clicked
      }
    });
  };

  const toggleFigureBtnColor = (key) => {
    divRef.current.querySelectorAll(`.f-${key}`).forEach((el) => {
      el.style.background = myReduceFigureKeys[key].clicked
        ? "inherit"
        : "#93ad64";
    });

    setMyReduceFigureKeys({
      ...myReduceFigureKeys,
      [key]: {
        ...myReduceFigureKeys[key],
        clicked: !myReduceFigureKeys[key].clicked
      }
    });
  };

  const toggleWrongFigureBtnColor = (key) => {
    divRef.current.querySelectorAll(`.ef-${key}`).forEach((el) => {
      el.style.background = myReduceWrongFigureKeys[key].clicked
        ? "inherit"
        : "red";
    });

    setMyReduceWrongFigureKeys({
      ...myReduceWrongFigureKeys,
      [key]: {
        ...myReduceWrongFigureKeys[key],
        clicked: !myReduceWrongFigureKeys[key].clicked
      }
    });
  };

  const toggleAboriginalWordBtnColor = (key) => {
    divRef.current.querySelectorAll(`.ab-${key}`).forEach((el) => {
      el.style.background = myReduceAboriginalWordKeys[key].clicked
        ? "inherit"
        : "rgb(188, 174, 174)";
    });

    setMyReduceAboriginalWordKeys({
      ...myReduceAboriginalWordKeys,
      [key]: {
        ...myReduceAboriginalWordKeys[key],
        clicked: !myReduceAboriginalWordKeys[key].clicked
      }
    });
  };

  const togglePotentialErrorBtnColor = (key) => {
    divRef.current.querySelectorAll(`.pe-${key}`).forEach((el) => {
      el.style.background = myReducePotentialWrongKeys[key].clicked
        ? "inherit"
        : "rgb(202 117 117)";
      el.style.fontStyle = myReducePotentialWrongKeys[key].clicked
        ? "normal"
        : "italic";
    });

    setMyReducePotentialWrongKeys({
      ...myReducePotentialWrongKeys,
      [key]: {
        ...myReducePotentialWrongKeys[key],
        clicked: !myReducePotentialWrongKeys[key].clicked
      }
    });
  };

  const buildList = (modifiedParagraphWithSearchStr) => {
    // Test
    // if (general === "0005") {
    //   console.log("rebuild list");
    //   console.log(globalHighlightElement);
    // }

    divRef.current.querySelector(".content").innerHTML = `【${general}】 ${
      modifiedParagraphWithSearchStr || modifiedParagraph
    }`;

    let reduceFigureKeys = {};
    figureKeys.forEach((figureKey) => {
      if (!reduceFigureKeys[figureKey.group]) {
        reduceFigureKeys[figureKey.group] = {
          ...figureKey,
          clicked: true
        };
      }
    });

    let reduceWrongFigureKeys = {};
    wrongFigureKeys.forEach((wrongFigureKey) => {
      if (!reduceWrongFigureKeys[wrongFigureKey.group]) {
        reduceWrongFigureKeys[wrongFigureKey.group] = {
          ...wrongFigureKey,
          clicked: true
        };
      }
    });

    let reduceCorrectKeys = {};
    correctKeys.forEach((correctKey) => {
      if (reduceCorrectKeys[correctKey.group]) {
        const currentKeys = correctKey.keys;
        currentKeys.forEach((key) => {
          if (!reduceCorrectKeys[correctKey.group].keys.includes(key)) {
            reduceCorrectKeys[correctKey.group].keys.push(key);
            reduceCorrectKeys[correctKey.group] = {
              ...correctKey,
              value:
                correctKey.item +
                reduceCorrectKeys[correctKey.group].keys
                  .filter((k) => k !== "")
                  .join("、"),
              keys: reduceCorrectKeys[correctKey.group].keys,
              // clicked: true
              clicked:
                globalHighlightOn &&
                (globalHighlightElement.length === 0 ||
                  globalHighlightElement.find((g) => g === correctKey.group))
            };
          }
        });
      } else {
        reduceCorrectKeys[correctKey.group] = {
          ...correctKey,
          value:
            correctKey.item +
            correctKey.keys.filter((k) => k !== "").join("、"),
          // clicked: true
          clicked:
            globalHighlightOn &&
            (globalHighlightElement.length === 0 ||
              globalHighlightElement.find((g) => g === correctKey.group))
        };
      }
    });

    let reduceWrongKeys = {};
    wrongKeys.forEach((wrongKey) => {
      if (reduceWrongKeys[wrongKey.group]) {
        const currentKeys = wrongKey.wrongKeys;
        currentKeys.forEach((key) => {
          if (!reduceWrongKeys[wrongKey.group].wrongKeys.includes(key)) {
            reduceWrongKeys[wrongKey.group].wrongKeys.push(key);
            reduceWrongKeys[wrongKey.group] = {
              ...wrongKey,
              value:
                wrongKey.item +
                reduceWrongKeys[wrongKey.group].wrongKeys
                  .filter((k) => k !== "")
                  .join("、"),
              wrongKeys: reduceWrongKeys[wrongKey.group].wrongKeys,
              clicked: true
            };
          }
        });
      } else {
        reduceWrongKeys[wrongKey.group] = {
          ...wrongKey,
          value:
            wrongKey.item +
            wrongKey.wrongKeys.filter((k) => k !== "").join("、"),
          clicked: true
        };
      }
    });

    let reducePotentialWrongKeys = {};
    potentialWrongKeys.forEach((potentialWrongKey) => {
      if (reducePotentialWrongKeys[potentialWrongKey.group]) {
        const currentKeys = potentialWrongKey.keys;
        currentKeys.forEach((key) => {
          if (
            !reducePotentialWrongKeys[potentialWrongKey.group].keys.includes(
              key
            )
          ) {
            reducePotentialWrongKeys[potentialWrongKey.group].keys.push(key);
            reducePotentialWrongKeys[potentialWrongKey.group] = {
              ...potentialWrongKey,
              value:
                potentialWrongKey.item /*+
                reducePotentialWrongKeys[potentialWrongKey.group].keys
                  .filter((k) => k !== "")
                  .join("、")*/,
              keys: reducePotentialWrongKeys[potentialWrongKey.group].keys,
              clicked: true
            };
          }
        });
      } else {
        reducePotentialWrongKeys[potentialWrongKey.group] = {
          ...potentialWrongKey,
          value:
            potentialWrongKey.item /*+
            potentialWrongKey.keys.filter((k) => k !== "").join("、")*/,
          clicked: true
        };
      }
    });

    let reduceWrongWordKeys = {};
    wrongWordKeys.forEach((wrongWordKey) => {
      if (!reduceWrongWordKeys[wrongWordKey.group]) {
        reduceWrongWordKeys[wrongWordKey.group] = {
          ...wrongWordKey,
          clicked: true
        };
      }
    });

    let reduceAboriginalWordKeys = {};
    aboriginalWordKeys.forEach((aboriginalWordKey) => {
      if (!reduceAboriginalWordKeys[aboriginalWordKey.group]) {
        reduceAboriginalWordKeys[aboriginalWordKey.group] = {
          ...aboriginalWordKey,
          clicked: true
        };
      }
    });

    setMyReduceCorrectKeys(reduceCorrectKeys);
    setMyReduceWrongKeys(reduceWrongKeys);
    setMyReducePotentialWrongKeys(reducePotentialWrongKeys);
    setMyReduceWrongWordKeys(reduceWrongWordKeys);
    setMyReduceAboriginalWordKeys(reduceAboriginalWordKeys);
    setMyReduceFigureKeys(reduceFigureKeys);
    setMyReduceWrongFigureKeys(reduceWrongFigureKeys);

    Object.keys(reduceCorrectKeys).forEach((key) => {
      divRef.current.querySelectorAll(`.c-${key}`).forEach((el) => {
        el.style.cursor = "pointer";
        el.style.background = reduceCorrectKeys[key].clicked
          ? elementColorMap[key].color
          : "inherit";
      });
    });

    Object.keys(reduceWrongKeys).forEach((key) => {
      divRef.current.querySelectorAll(`.e-${key}`).forEach((el) => {
        el.style.cursor = "pointer";
      });
    });
    Object.keys(reducePotentialWrongKeys).forEach((key) => {
      divRef.current.querySelectorAll(`.pe-${key}`).forEach((el) => {
        el.style.cursor = "pointer";
      });
    });
    Object.keys(reduceWrongWordKeys).forEach((key) => {
      divRef.current.querySelectorAll(`.ew-${key}`).forEach((el) => {
        el.style.cursor = "pointer";
      });
    });
    Object.keys(reduceAboriginalWordKeys).forEach((key) => {
      divRef.current.querySelectorAll(`.ab-${key}`).forEach((el) => {
        el.style.cursor = "pointer";
      });
    });
    Object.keys(reduceFigureKeys).forEach((key) => {
      divRef.current.querySelectorAll(`.f-${key}`).forEach((el) => {
        el.style.cursor = "pointer";
      });
    });
    Object.keys(reduceWrongFigureKeys).forEach((key) => {
      divRef.current.querySelectorAll(`.ef-${key}`).forEach((el) => {
        el.style.cursor = "pointer";
      });
    });
  };
  /*
  useEffect(() => {
    // console.log("useEffect~~~~");

    // divRef.current.querySelector("h2").style.background =
    //   "rgb(147, 173, 100)";
    buildList("");
  }, [content, general]);
  */

  useEffect(() => {
    // if (!modifiedParagraph || searchStringPrev.current === searchString) {
    //   return;
    // }

    if (essentialData.personalSettings.readingModePureText) {
      divRef.current.querySelector(".content").innerHTML = content;
      return;
    }

    if (
      searchString === "" /* && searchStringPrev.current !== searchString */
    ) {
      searchStringPrev.current = searchString;
      return buildList("");
    }

    searchStringPrev.current = searchString;
    // console.log("rebuildlist");
    const htmlReg = RegExp("<(\"[^\"]*\"|'[^']*'|[^'\">])*>", "g");
    let nonModifiedParagraph = modifiedParagraph.replaceAll(htmlReg, "@");
    let tagLists = [...modifiedParagraph.matchAll(htmlReg)];
    tagLists.forEach((tagList, idx) => {
      for (let i = idx + 1; i < tagLists.length; i++) {
        tagLists[i].index -= tagList[0].length - 1;
      }
    });
    let insertLists = tagLists.map((tagList) => ({
      start: tagList.index,
      content: tagList[0]
    }));

    const searchStringMatches = [
      ...nonModifiedParagraph.matchAll(
        RegExp(searchString.split("").join("@?"), "g")
      )
    ];
    setNumOfFoundedStr(searchStringMatches.length);

    searchStringMatches.forEach((mt) => {
      for (let j = mt.index; j < mt.index + mt[0].length; j++) {
        if (nonModifiedParagraph[j] === "@") {
          continue;
        }
        insertLists.push({
          start: j,
          content: `<strong class='search-highlight'>${nonModifiedParagraph[j]}</strong>`
        });
      }
    });

    insertLists.sort((a, b) => a.start - b.start);

    for (let i = insertLists.length - 1; i >= 0; i--) {
      nonModifiedParagraph =
        nonModifiedParagraph.slice(0, insertLists[i].start) +
        insertLists[i].content +
        nonModifiedParagraph.slice(insertLists[i].start + 1);
    }
    // Test
    // if (index === 0) {
    //   console.log(insertLists);
    //   console.log(nonModifiedParagraph);
    //   debugger;
    // }
    buildList(nonModifiedParagraph);
  }, [
    searchString,
    content,
    general,
    globalHighlightOn,
    globalHighlightElement,
    essentialData.personalSettings.synchronizeHighlight,
    essentialData.personalSettings.readingModePureText
  ]);

  useEffect(() => {
    const divRefCurrent = divRef.current;

    const handler = (e) => triggerToggleBtnColor(e, toggleBtnColor);

    if (Object.keys(myReduceCorrectKeys).length > 0) {
      // console.log("add myReduceNonMatches eventListener...");
      Object.keys(myReduceCorrectKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.c-${key}`).forEach((el) => {
          el.addEventListener("click", handler);
        });
      });
    }

    return () => {
      // console.log("remove myReduceNonMatches eventListener...");
      Object.keys(myReduceCorrectKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.c-${key}`).forEach((el) => {
          el.removeEventListener("click", handler);
        });
      });
    };
  }, [myReduceCorrectKeys]);

  useEffect(() => {
    const divRefCurrent = divRef.current;

    const handler = (e) => triggerToggleErrorBtnColor(e, toggleErrorBtnColor);

    if (Object.keys(myReduceWrongKeys).length > 0) {
      // console.log("add myReduceNonMatches eventListener...");
      Object.keys(myReduceWrongKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.e-${key}`).forEach((el) => {
          el.addEventListener("click", handler);
        });
      });
    }

    return () => {
      // console.log("remove myReduceNonMatches eventListener...");
      Object.keys(myReduceWrongKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.e-${key}`).forEach((el) => {
          el.removeEventListener("click", handler);
        });
      });
    };
  }, [myReduceWrongKeys]);

  useEffect(() => {
    const divRefCurrent = divRef.current;

    const handler = (e) =>
      triggerTogglePotentialErrorBtnColor(e, togglePotentialErrorBtnColor);

    if (Object.keys(myReducePotentialWrongKeys).length > 0) {
      // console.log("add myReduceNonMatches eventListener...");
      Object.keys(myReducePotentialWrongKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.pe-${key}`).forEach((el) => {
          el.addEventListener("click", handler);
        });
      });
    }

    return () => {
      // console.log("remove myReduceNonMatches eventListener...");
      Object.keys(myReducePotentialWrongKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.pe-${key}`).forEach((el) => {
          el.removeEventListener("click", handler);
        });
      });
    };
  }, [myReducePotentialWrongKeys]);

  useEffect(() => {
    const divRefCurrent = divRef.current;

    const handler = (e) =>
      triggerToggleWrongWordBtnColor(e, toggleWrongWordBtnColor);

    if (Object.keys(myReduceWrongWordKeys).length > 0) {
      // console.log("add myReduceNonMatches eventListener...");
      Object.keys(myReduceWrongWordKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.ew-${key}`).forEach((el) => {
          el.addEventListener("click", handler);
        });
      });
    }

    return () => {
      // console.log("remove myReduceNonMatches eventListener...");
      Object.keys(myReduceWrongWordKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.ew-${key}`).forEach((el) => {
          el.removeEventListener("click", handler);
        });
      });
    };
  }, [myReduceWrongWordKeys]);

  useEffect(() => {
    const divRefCurrent = divRef.current;

    const handler = (e) =>
      triggerToggleAboriginalWordBtnColor(e, toggleAboriginalWordBtnColor);

    if (Object.keys(myReduceAboriginalWordKeys).length > 0) {
      // console.log("add myReduceNonMatches eventListener...");
      Object.keys(myReduceAboriginalWordKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.ab-${key}`).forEach((el) => {
          el.addEventListener("click", handler);
        });
      });
    }

    return () => {
      // console.log("remove myReduceNonMatches eventListener...");
      Object.keys(myReduceAboriginalWordKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.ab-${key}`).forEach((el) => {
          el.removeEventListener("click", handler);
        });
      });
    };
  }, [myReduceAboriginalWordKeys]);

  useEffect(() => {
    const divRefCurrent = divRef.current;

    const handler = (e) => triggerToggleFigureBtnColor(e, toggleFigureBtnColor);

    if (Object.keys(myReduceFigureKeys).length > 0) {
      // console.log("add myReduceNonMatches eventListener...");
      Object.keys(myReduceFigureKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.f-${key}`).forEach((el) => {
          el.addEventListener("click", handler);
        });
      });
    }

    return () => {
      // console.log("remove myReduceNonMatches eventListener...");
      Object.keys(myReduceFigureKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.f-${key}`).forEach((el) => {
          el.removeEventListener("click", handler);
        });
      });
    };
  }, [myReduceFigureKeys]);

  useEffect(() => {
    const divRefCurrent = divRef.current;

    const handler = (e) =>
      triggerToggleWrongFigureBtnColor(e, toggleWrongFigureBtnColor);

    if (Object.keys(myReduceWrongFigureKeys).length > 0) {
      // console.log("add myReduceNonMatches eventListener...");
      Object.keys(myReduceWrongFigureKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.ef-${key}`).forEach((el) => {
          el.addEventListener("click", handler);
        });
      });
    }

    return () => {
      // console.log("remove myReduceNonMatches eventListener...");
      Object.keys(myReduceWrongFigureKeys).forEach((key) => {
        divRefCurrent.querySelectorAll(`.ef-${key}`).forEach((el) => {
          el.removeEventListener("click", handler);
        });
      });
    };
  }, [myReduceWrongFigureKeys]);

  return (
    <div className="paragraph-container not-claim" ref={divRef}>
      <h2 onClick={() => setIsCollapse(index, dataType)}>
        {Object.keys(myReduceWrongKeys).length === 0 &&
          Object.keys(myReducePotentialWrongKeys).length === 0 &&
          Object.keys(myReduceWrongWordKeys).length === 0 &&
          Object.keys(myReduceWrongFigureKeys).length === 0 && (
            <img src={checkedImg} alt="" />
          )}
        {(Object.keys(myReduceWrongKeys).length > 0 ||
          Object.keys(myReduceWrongWordKeys).length > 0 ||
          Object.keys(myReduceWrongFigureKeys).length > 0) && (
          <img src={errorImg} alt="" />
        )}
        {Object.keys(myReducePotentialWrongKeys).length > 0 && (
          <img src={warningImg} alt="" />
        )}
        {Object.keys(myReduceAboriginalWordKeys).length > 0 && (
          <img src={aboriginalImg} alt="" />
        )}
        {dataType === "disclosure"
          ? applicationNum[3] === "1"
            ? "發明內容"
            : "新型內容"
          : "實施方式"}
        【{general}】
        {searchString && (
          <>
            {numOfFoundedStr === 0 ? (
              <small>{" ".repeat(6)}無結果</small>
            ) : (
              <small>
                {" ".repeat(6)}搜尋結果:{numOfFoundedStr}筆
              </small>
            )}
          </>
        )}
        {!isCollapse ? (
          <span>&#x292C;</span>
        ) : (
          <span style={{ height: "1.38em", lineHeight: "1.25em" }}>
            &#x271B;
          </span>
        )}
      </h2>
      <section className={isCollapse ? "collapse" : ""}>
        {!essentialData.personalSettings.readingModePureText &&
          essentialData.personalSettings.synchronizeHighlight && (
            <p
              style={{
                color: "rgb(68 112 69)",
                fontWeight: "bold",
                marginLeft: "2.5vw",
                display: "flex"
              }}
            >
              <span>&#9733;說明書、申請專利範圍之所有構件皆同步highlight</span>
              {(!globalHighlightOn || globalHighlightElement.length > 0) && (
                <button
                  style={highlightButtonStyle}
                  onClick={() =>
                    setEssentialData((prev) => ({
                      ...prev,
                      globalHighlightOn: true,
                      globalHighlightElement: []
                    }))
                  }
                >
                  開啟標註
                </button>
              )}
              {globalHighlightOn && globalHighlightElement.length === 0 && (
                <button
                  style={highlightButtonStyle}
                  onClick={() =>
                    setEssentialData((prev) => ({
                      ...prev,
                      globalHighlightOn: false
                    }))
                  }
                >
                  關閉標註
                </button>
              )}
            </p>
          )}
        {essentialData.personalSettings.readingModePureText && (
          <p
            style={{
              color: "rgb(186 48 48)",
              fontWeight: "bold",
              marginLeft: "2.5vw"
            }}
          >
            &#9733;閱讀模式為純文字模式
          </p>
        )}
        <p className="content">Sorry! 無法分析本段落!!!</p>
        <div className="paragraph-container-btns">
          <button
            className="gotop-btn"
            style={{ position: "relative" }}
            onClick={() =>
              document
                .querySelector(".main-body .main-body-grid-item:nth-of-type(1)")
                .scrollTo({ top: 0, behavior: "smooth" })
            }
          >
            Go Top
          </button>
        </div>
      </section>
    </div>
  );
};

export default SingleParagraphSimple;

import { allThisWords } from "../../dict/allThisWords";

export const triggerToggleBtnColor = (e, toggleBtnColor) => {
  // console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("c-") || allClasses[i].startsWith("u-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  // console.log(wantedClass);
  toggleBtnColor(wantedClass.replace(/[cu]-/, ""));
};

export const triggerToggleErrorBtnColor = (e, toggleErrorBtnColor) => {
  // console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("e-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  // console.log(wantedClass);
  toggleErrorBtnColor(wantedClass.replace("e-", ""));
};

export const triggerToggleModifiedBtnColor = (e, toggleModifiedBtnColor) => {
  // console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("m-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  // console.log(wantedClass);
  toggleModifiedBtnColor(wantedClass.replace("m-", ""));
};

export const triggerPopup = (
  event,
  {
    content,
    matches,
    usedElements,
    setPopupStart,
    setPopupEnd,
    setPopupIndex,
    setPopupItem,
    setPopupFullValue,
    setPopupAvailableContent,
    toggleIsPopupOpen
  }
) => {
  const {
    elitem,
    elvalue,
    elfullvalue,
    start: _start,
    end: _end,
    realstart: _realstart,
    indexofmatch
  } = event.currentTarget.dataset;
  const start = parseInt(_start);
  const end = parseInt(_end);
  const valueEnd = start + elvalue.length;
  const realstart = parseInt(_realstart);
  setPopupStart(start);
  // setPopupEnd(end);
  setPopupEnd(valueEnd);
  setPopupIndex(parseInt(indexofmatch));
  setPopupItem(elitem);
  setPopupFullValue(elfullvalue === "none" ? "" : elfullvalue);
  setPopupAvailableContent(() => {
    // const nextStart = [...matches, ...usedElements, ...preUsedElementsNonUsed]
    const nextStart = [...matches, ...usedElements]
      .sort((a, b) => a.start - b.start)
      .find((mt) => (mt.realStart || mt.start) >= end);

    // console.log(nextStart);
    // debugger;

    let valueStartAt = start;
    if (realstart >= 0) {
      valueStartAt =
        realstart +
        content.slice(realstart).match(RegExp(allThisWords()))[0].length;
    }
    const frontStr = content.substring(valueStartAt, valueEnd);
    const availableStr = nextStart
      ? content.substring(valueEnd, nextStart.realStart || nextStart.start)
      : content.substring(valueEnd, content.length);
    const endStrMatch = availableStr.match(
      RegExp(
        "(@|、|，|、|，|-|；|:|,|。|/|\\\\|\\?|\\.|\\+|\\[|\\]|\\(|\\)|{|}|「|」)"
      )
    );
    if (endStrMatch) {
      return {
        startAt: valueStartAt,
        content: frontStr + availableStr.slice(0, endStrMatch.index)
      };
    } else {
      return {
        startAt: valueStartAt,
        content: frontStr + availableStr
      };
    }
  });
  toggleIsPopupOpen((prev) => !prev);
};

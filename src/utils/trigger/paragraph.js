export const triggerToggleBtnColor = (e, toggleBtnColor) => {
  // console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("c-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  if (wantedClass) toggleBtnColor(wantedClass.replace("c-", ""));
};

export const triggerToggleErrorBtnColor = (e, toggleErrorBtnColor) => {
  console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("e-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  if (wantedClass) toggleErrorBtnColor(wantedClass.replace("e-", ""));
};

export const triggerTogglePotentialErrorBtnColor = (
  e,
  togglePotentialErrorBtnColor
) => {
  // console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("pe-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  // console.log(wantedClass);
  if (wantedClass) togglePotentialErrorBtnColor(wantedClass.replace("pe-", ""));
};

export const triggerToggleWrongWordBtnColor = (e, toggleWrongWordBtnColor) => {
  // console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("ew-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  // console.log(wantedClass);
  if (wantedClass) toggleWrongWordBtnColor(wantedClass.replace("ew-", ""));
};

export const triggerToggleAboriginalWordBtnColor = (
  e,
  toggleAboriginalWordBtnColor
) => {
  // console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("ab-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  // console.log(wantedClass);
  if (wantedClass) toggleAboriginalWordBtnColor(wantedClass.replace("ab-", ""));
};

export const triggerToggleFigureBtnColor = (e, toggleFigureBtnColor) => {
  // console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("f-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  // console.log(wantedClass);
  if (wantedClass) toggleFigureBtnColor(wantedClass.replace("f-", ""));
};

export const triggerToggleWrongFigureBtnColor = (
  e,
  toggleWrongFigureBtnColor
) => {
  // console.log(e.target.classList);
  const allClasses = e.target.classList;
  let wantedClass;
  for (let i = 0; i < allClasses.length; i++) {
    if (allClasses[i].startsWith("ef-")) {
      wantedClass = allClasses[i];
      break;
    }
  }
  // console.log(wantedClass);
  if (wantedClass) toggleWrongFigureBtnColor(wantedClass.replace("ef-", ""));
};

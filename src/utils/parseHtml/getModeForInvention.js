function getModeForInvention(root, general) {
  const modeForInventionElement = Array.from(
    root.querySelectorAll("p")
  ).filter((p) => p.innerText.match(/【實\s*施\s*方\s*式】/))[0];

  const modeForInventionFields = [];
  if (modeForInventionElement?.nextElementSibling?.tagName === "OL") {
    Array.from(
      modeForInventionElement.nextElementSibling.querySelectorAll("li")
    ).forEach((li) => {
      let generalStr = general.generalIdx + "";
      modeForInventionFields.push({
        general: "0".repeat(4 - generalStr.length) + generalStr,
        content: li.innerText.trim()
      });
      general.generalIdx++;
    });
    console.log("【實施方式】", modeForInventionFields);
  }
  return { modeForInventionFields };
}

export default getModeForInvention;

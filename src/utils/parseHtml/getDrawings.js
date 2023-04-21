function getDrawings(root, general) {
  // 找圖式簡單說明
  const drawingElement = Array.from(root.querySelectorAll("p")).filter((p) =>
    p.innerText.match(/【圖\s*式\s*簡\s*單\s*說\s*明】/)
  )[0];
  const drawingElementFields = [];

  if (drawingElement?.nextElementSibling?.tagName === "OL") {
    Array.from(
      drawingElement.nextElementSibling.querySelectorAll("li")
    ).forEach((li) => {
      let generalStr = general.generalIdx + "";
      drawingElementFields.push({
        general: "0".repeat(4 - generalStr.length) + generalStr,
        content: li.innerText.trim()
      });
      general.generalIdx++;
    });
    console.log("【圖式簡單說明】", drawingElementFields);
  } else if (
    drawingElement?.nextElementSibling?.tagName === "P" &&
    !drawingElement?.nextElementSibling?.innerText.trim().match(/^【.*】/)
  ) {
    let generalStr = general.generalIdx + "";
    general.generalIdx++;
    drawingElementFields.push({
      general: "0".repeat(4 - generalStr.length) + generalStr,
      drawings: []
    });
    let currentDrawingElement = drawingElement.nextElementSibling;
    while (
      currentDrawingElement &&
      currentDrawingElement.tagName === "P" &&
      !currentDrawingElement.innerText.trim().match(/^【.*】/)
    ) {
      drawingElementFields[0].drawings.push(
        currentDrawingElement.innerText.trim()
      );
      currentDrawingElement = currentDrawingElement.nextElementSibling;
    }
    console.log("【圖式簡單說明】", drawingElementFields);
  }
  return { drawingElementFields };
}

export default getDrawings;

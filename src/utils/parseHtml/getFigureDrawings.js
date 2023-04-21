import extractTable from "./extractTable";

function getFigureDrawing(root) {
  // 找指定代表圖
  const figureDrawingIdxElement = Array.from(
    root.querySelectorAll("p")
  ).filter((p) =>
    p.innerText.trim().match(/^【本?\s*案?\s*指\s*定\s*代\s*表\s*圖】/)
  )[0];

  let figureDrawingIdx;

  if (figureDrawingIdxElement) {
    figureDrawingIdx =
      figureDrawingIdxElement.innerText
        .trim()
        .split(/[：:，,]/)
        .at(-1)
        ?.replaceAll(/[^\w\u4E00-\u9FFF]/g, "") ?? "";
    console.log("【指定代表圖】", figureDrawingIdx);
  }

  // 代表圖之符號簡單說明
  const figureDrawingElement = Array.from(
    root.querySelectorAll("p")
  ).filter((p) =>
    p.innerText
      .trim()
      .match(/^【本?\s*案?\s*代\s*表\s*圖\s*之\s*符\s*號\s*簡\s*單\s*說\s*明】/)
  )[0];

  const figureDrawingFields = [];

  if (figureDrawingElement?.nextElementSibling?.tagName === "P") {
    let currentElement = figureDrawingElement.nextElementSibling;
    while (
      currentElement &&
      currentElement.tagName === "P" &&
      !currentElement.innerText.trim().includes(["專利說明書"]) &&
      currentElement.innerText.trim().match(/[\d\w]/) &&
      !currentElement.innerText.trim().match(/【.*】/)
    ) {
      figureDrawingFields.push(currentElement.innerText.trim());
      currentElement = currentElement.nextElementSibling;
    }
    console.log("【代表圖之符號簡單說明】", figureDrawingFields);
  } else if (figureDrawingElement?.nextElementSibling?.tagName === "TABLE") {
    figureDrawingElement.nextElementSibling.setAttribute("id", "figure-table");
    figureDrawingFields.push(...extractTable(root, "#figure-table"));
    console.log("【代表圖之符號簡單說明】", figureDrawingFields);
  }

  return { figureDrawingIdx, figureDrawingFields };
}

export default getFigureDrawing;

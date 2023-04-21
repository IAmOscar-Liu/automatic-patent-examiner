import extractTable from "./extractTable";

function getDescriptionDrawings(root) {
  // 符號說明
  const descriptionOfDrawingElement = Array.from(
    root.querySelectorAll("p")
  ).filter((p) => p.innerText.trim().match(/^【符\s*號\s*說\s*明】/))[0];

  const descriptionOfElementFields = [];

  if (descriptionOfDrawingElement?.nextElementSibling?.tagName === "P") {
    let currentElement = descriptionOfDrawingElement.nextElementSibling;
    while (
      currentElement &&
      currentElement.tagName === "P" &&
      !currentElement.innerText.trim().includes(["申請專利範圍"]) &&
      currentElement.innerText.trim().match(/[\d\w]/) &&
      !currentElement.innerText.trim().match(/【.*】/)
    ) {
      descriptionOfElementFields.push(currentElement.innerText.trim());
      currentElement = currentElement.nextElementSibling;
    }
    console.log("【符號說明】", descriptionOfElementFields);
  } else if (
    descriptionOfDrawingElement?.nextElementSibling?.tagName === "TABLE"
  ) {
    descriptionOfDrawingElement.nextElementSibling.setAttribute(
      "id",
      "description-table"
    );
    descriptionOfElementFields.push(
      ...extractTable(root, "#description-table")
    );
    console.log("【符號說明】", descriptionOfElementFields);
  }
  return { descriptionOfElementFields };
}

export default getDescriptionDrawings;

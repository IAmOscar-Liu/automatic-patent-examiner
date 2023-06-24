import { create } from "xmlbuilder2";

function xmlbuilder({
  patentType,
  title,
  titleEn,
  abstract,
  abstractEn,
  techFields,
  backgroundArtFields,
  disclosureFields,
  drawingElementFields,
  modeForInventionFields,
  claimFields,
  figureDrawingIdx,
  figureDrawingFields,
  descriptionOfElementFields,
}) {
  patentType =
    process.env.REACT_APP_SYSTEM_TYPE === "tipo" &&
    process.env.REACT_APP_PATENT_TYPE?.includes("invention")
      ? patentType
      : "新型";

  const root =
    patentType === "發明"
      ? create({ version: "1.0" }).ele("invention-specification", {
          "application-num": `${new Date().getFullYear() - 1911 + ""}1XXXXX`,
        })
      : create({ version: "1.0" }).ele("utility-model-specification", {
          "application-num": `${new Date().getFullYear() - 1911 + ""}2XXXXX`,
        });

  // 中文摘要
  if (abstract.length > 0) {
    const abstractEle = root
      .ele("abstract", { lang: "tw" })
      .ele("abstract-dtext");
    for (let ab of abstract) abstractEle.ele("p", { general: "" }).txt(ab);
  }
  // 英文摘要
  if (abstractEn.length > 0) {
    const abstractEle = root
      .ele("abstract", { lang: "en" })
      .ele("abstract-dtext");
    for (let ab of abstractEn) abstractEle.ele("p", { general: "" }).txt(ab);
  }
  // 中英文新型/發明名稱
  const descriptionEle = root.ele("description");
  if (title)
    descriptionEle
      .ele(patentType === "新型" ? "utility-model-title" : "invention-title", {
        lang: "tw",
      })
      .txt(title);
  if (titleEn)
    descriptionEle
      .ele(patentType === "新型" ? "utility-model-title" : "invention-title", {
        lang: "en",
      })
      .txt(titleEn);
  // 技術領域
  if (techFields.length > 0) {
    const techFieldsEle = descriptionEle.ele("technical-field");
    for (let { general, content } of techFields)
      techFieldsEle.ele("p", { general }).txt(content);
  }
  // 先前技術
  if (backgroundArtFields.length > 0) {
    const backgroundArtFieldsEle = descriptionEle.ele("background-art");
    for (let { general, content } of backgroundArtFields)
      backgroundArtFieldsEle.ele("p", { general }).txt(content);
  }
  // 新型/發明內容
  if (disclosureFields.length > 0) {
    const disclosureFieldsEle = descriptionEle.ele("disclosure");
    for (let { general, content } of disclosureFields)
      disclosureFieldsEle.ele("p", { general }).txt(content);
  }
  // 實施方式
  if (modeForInventionFields.length > 0) {
    const modeForInventionFieldsEle = descriptionEle.ele("mode-for-invention");
    for (let { general, content } of modeForInventionFields)
      modeForInventionFieldsEle.ele("p", { general }).txt(content);
  }
  // 符號說明 & 圖式簡單說明
  if (
    descriptionOfElementFields.length > 0 ||
    drawingElementFields.length > 0
  ) {
    const descriptionOfDrawingFieldsEle = descriptionEle.ele(
      "description-of-drawings"
    );
    // 符號說明
    if (descriptionOfElementFields.length > 0) {
      const pEle = descriptionOfDrawingFieldsEle
        .ele("description-of-element")
        .ele("p", { general: "" });
      for (let pIdx = 0; pIdx < descriptionOfElementFields.length; pIdx++) {
        pEle.txt(descriptionOfElementFields[pIdx]);
        if (pIdx < descriptionOfElementFields.length - 1) pEle.ele("br");
      }
    }
    // 圖式簡單說明
    if (drawingElementFields.length > 0) {
      for (let { general, content, drawings } of drawingElementFields) {
        const pEle = descriptionOfDrawingFieldsEle.ele("p", { general });
        if (content) pEle.txt(content);
        if (drawings) {
          for (let dIdx = 0; dIdx < drawings.length; dIdx++) {
            pEle.txt(drawings[dIdx]);
            if (dIdx < drawings.length - 1) pEle.ele("br");
          }
        }
      }
    }
  }

  // 申請專利範圍
  if (claimFields.length > 0) {
    const claimsEle = root.ele("claims");
    for (let { claimNum, content } of claimFields) {
      const claimTextEle = claimsEle
        .ele("claim", { dependency: "independent-claim", num: claimNum })
        .ele("claim-text");
      for (let cIdx = 0; cIdx < content.length; cIdx++) {
        claimTextEle.txt(content[cIdx]);
        if (cIdx < content.length - 1) claimTextEle.ele("br");
      }
    }
  }
  // 代表圖之符號簡單說明
  if (figureDrawingFields.length > 0) {
    const pEle = root
      .ele("figure-drawings", {
        lang: "",
        "figure-labels": figureDrawingIdx,
      })
      .ele("p", { general: "" });
    for (let fIdx = 0; fIdx < figureDrawingFields.length; fIdx++) {
      pEle.txt(figureDrawingFields[fIdx]);
      if (fIdx < figureDrawingFields.length - 1) pEle.ele("br");
    }
  }

  // convert the XML tree to string
  const xml = root.end({ prettyPrint: true });

  return xml;
}

export default xmlbuilder;

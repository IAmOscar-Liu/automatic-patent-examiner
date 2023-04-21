import { parse } from "node-html-parser";
import getAbstract from "./getAbstract";
import getClaims from "./getClaims";
import getDescriptionDrawings from "./getDescriptionDrawing";
import getDrawings from "./getDrawings";
import getFigureDrawing from "./getFigureDrawings";
import getModeForInvention from "./getModeForInvention";
import getTechFieldAndBackgroundArtAndDisclosure from "./getTechFieldAndBackgroundArtAndDisclosure";
import getTitle from "./getTitle";

function parseHTML(html) {
  const root = parse(html);

  // 找中英文新型名稱
  const { title, titleEn, titleElement } = getTitle(root);

  // 找中英文摘要
  const { abstract, abstractEn } = getAbstract(titleElement);

  const general = { generalIdx: 1 };

  // 找技術領域、先前技術、新型內容
  const {
    techFields,
    backgroundArtFields,
    disclosureFields
  } = getTechFieldAndBackgroundArtAndDisclosure(root, general);

  // 找圖式簡單說明
  const { drawingElementFields } = getDrawings(root, general);

  // 找實施方式
  const { modeForInventionFields } = getModeForInvention(root, general);

  // 找申請專利範圍
  const { claimFields } = getClaims(root);

  // 找代表圖之符號簡單說明
  const { figureDrawingIdx, figureDrawingFields } = getFigureDrawing(root);

  // 找符號說明
  const { descriptionOfElementFields } = getDescriptionDrawings(root);

  return {
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
    descriptionOfElementFields
  };
}

export default parseHTML;

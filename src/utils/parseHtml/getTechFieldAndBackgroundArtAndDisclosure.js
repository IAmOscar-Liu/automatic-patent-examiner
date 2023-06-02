function getTechFieldAndBackgroundArtAndDisclosure(root, general) {
  const techFields = [];
  const backgroundArtFields = [];
  const disclosureFields = [];

  // 找技術領域
  const techFieldElement = Array.from(root.querySelectorAll("p")).filter((p) =>
    p.innerText.match(/【技\s*術\s*領\s*域】/)
  )[0];

  if (techFieldElement?.nextElementSibling?.tagName === "OL") {
    Array.from(
      techFieldElement.nextElementSibling.querySelectorAll("li")
    ).forEach((li) => {
      let generalStr = general.generalIdx + "";
      techFields.push({
        general: "0".repeat(4 - generalStr.length) + generalStr,
        content: li.innerText.trim(),
      });
      general.generalIdx++;
    });
    console.log("【技術領域】", techFields);
  }

  // 找先前技術
  const backgroundArtElement = Array.from(root.querySelectorAll("p")).filter(
    (p) => p.innerText.match(/【先\s*前\s*技\s*術】/)
  )[0];

  if (backgroundArtElement?.nextElementSibling?.tagName === "OL") {
    Array.from(
      backgroundArtElement.nextElementSibling.querySelectorAll("li")
    ).forEach((li) => {
      let generalStr = general.generalIdx + "";
      backgroundArtFields.push({
        general: "0".repeat(4 - generalStr.length) + generalStr,
        content: li.innerText.trim(),
      });
      general.generalIdx++;
    });
    console.log("【先前技術】", backgroundArtFields);
  }

  // 找新型內容
  const disclosureElement = Array.from(root.querySelectorAll("p")).filter((p) =>
    p.innerText.match(/【(新|發)\s*(型|明)\s*內\s*容】/)
  )[0];

  if (disclosureElement?.nextElementSibling?.tagName === "OL") {
    Array.from(
      disclosureElement.nextElementSibling.querySelectorAll("li")
    ).forEach((li) => {
      let generalStr = general.generalIdx + "";
      disclosureFields.push({
        general: "0".repeat(4 - generalStr.length) + generalStr,
        content: li.innerText.trim(),
      });
      general.generalIdx++;
    });
    console.log("【新型內容】", disclosureFields);
  }

  return { techFields, backgroundArtFields, disclosureFields };
}


export default getTechFieldAndBackgroundArtAndDisclosure;

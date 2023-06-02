function getTitle(root) {
  // 找中文新型/發明名稱
  const titleElement = Array.from(root.querySelectorAll("p")).filter((p) =>
    p.innerText.match(/【.*(新|發)\s*(型|明)\s*名\s*稱】/)
  )[0];
  const title =
    // titleElement?.innerText.trim().replace(/【.*新\s*型\s*名\s*稱】/, "") ?? "";
    titleElement?.innerText
      .trim()
      .replace(/【.*(新|發)\s*(型|明)\s*名\s*稱】/, "") ?? "";
  const patentType = titleElement?.innerText
    .trim()
    .match(/【.*發\s*明\s*名\s*稱】/, "")
    ? "發明"
    : "新型";
  console.log(`【中文${patentType}名稱】`, title);

  // 找英文新型/發明名稱
  let titleEn = "";
  if (
    titleElement &&
    titleElement.nextElementSibling &&
    titleElement.nextElementSibling.innerText
      .trim()
      .match(/【英\s*文\s*(新|發)\s*(型|明)\s*名\s*稱】/)
  ) {
    titleEn =
      titleElement.nextElementSibling.innerText
        .trim()
        .replace(/【英\s*文\s*(新|發)\s*(型|明)\s*名\s*稱】/, "") ?? "";
    console.log(`【英文${patentType}名稱】`, titleEn);
  }
  return { patentType, title, titleEn, titleElement };
}

export default getTitle;

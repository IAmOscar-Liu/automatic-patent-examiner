function getAbstract(titleElement) {
  const abstract = [];
  const abstractEn = [];

  // 找中文摘要
  let currentElement = titleElement.nextElementSibling;
  while (
    currentElement &&
    !currentElement.innerText.trim().match(/^【中\s*文.*(摘\s*要)?】/)
  ) {
    currentElement = currentElement.nextElementSibling;
  }
  currentElement = currentElement?.nextElementSibling;
  while (
    currentElement &&
    currentElement.tagName === "P" &&
    !currentElement.innerText.trim().match(/^【.*】/)
  ) {
    abstract.push(currentElement.innerText.trim());
    currentElement = currentElement.nextElementSibling;
  }

  console.log("【中文摘要】", abstract);

  // 找英文摘要
  while (
    currentElement &&
    !currentElement.innerText.trim().match(/^【英\s*文.*(摘\s*要)?】/)
  ) {
    currentElement = currentElement.nextElementSibling;
  }

  currentElement = currentElement?.nextElementSibling;
  while (
    currentElement &&
    currentElement.tagName === "P" &&
    !currentElement.innerText.trim().match(/^【.*】/)
  ) {
    abstractEn.push(currentElement.innerText.trim());
    currentElement = currentElement.nextElementSibling;
  }

  console.log("【英文摘要】", abstractEn);

  return { abstract, abstractEn };
}

export default getAbstract;

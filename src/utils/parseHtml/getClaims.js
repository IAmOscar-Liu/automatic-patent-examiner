function getClaims(root) {
  const claimElements = Array.from(root.querySelectorAll("p")).filter((p) =>
    p.innerText.trim().match(/^【請\s*求\s*項\s*\d+】/)
  );
  const claimFields = [];
  for (let i = 0; i < claimElements.length; i++) {
    const claimNum = claimElements[i].innerText
      .trim()
      .match(/^【請求項(\d+)】/)[1];
    const content = [
      claimElements[i].innerText.trim().replace(/^【請\s*求\s*項\s*\d+】/, "")
    ];
    let currentParagraph = claimElements[i].nextElementSibling;

    while (
      currentParagraph &&
      currentParagraph !== claimElements[i + 1] &&
      !currentParagraph.innerText.trim().startsWith("圖式") &&
      !currentParagraph.innerText.trim().match(/^【.*】/)
    ) {
      content.push(currentParagraph.innerText.trim());
      currentParagraph = currentParagraph.nextElementSibling;
    }
    claimFields.push({ claimNum, content });
  }
  console.log("【申請專利範圍】", claimFields);
  return { claimFields };
}

export default getClaims;

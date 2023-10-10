import extractTable from "./extractTable";

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
      claimElements[i].innerText.trim().replace(/^【請\s*求\s*項\s*\d+】/, ""),
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

  if (claimFields.length === 0) claimFields.push(...getClaims_v2(root));

  console.log("【申請專利範圍】", claimFields);
  return { claimFields };
}

function getClaims_v2(root) {
  //  p.innerText.match(/【(新|發)\s*(型|明)\s*內\s*容】/)
  const claimElements = Array.from(root.querySelectorAll("p")).filter((p) =>
    p.innerText
      .trim()
      .match(/【(新|發)?\s*(型|明)?\s*申\s*請\s*專\s*利\s*範\s*圍】/)
  );
  console.log("getClaims_v2~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
  try {
    if (!claimElements.length === 0) return [];

    const claimTitleElement = claimElements[claimElements.length - 1];
    // console.log(claimTitleElement.innerText);
    let currentElement = claimTitleElement.nextElementSibling;
    let idx = 1;
    const claimContentArr = [];
    while (currentElement && !currentElement.innerText.trim().match(/【.*】/)) {
      const elId = `claim-element-${idx}`;
      currentElement.setAttribute("id", elId);

      // console.log(currentElement.innerText);
      // console.log(root.querySelector("#" + elId));
      // console.log(root.querySelectorAll("#" + elId + " > *").length);
      // break;
      claimContentArr.push(...extractTable(root, "#" + elId));
      // console.log("claimContentArr: ", claimContentArr);

      idx++;
      currentElement = currentElement.nextElementSibling;
    }

    // console.log(claimContentArr);

    let claimNum = 1;
    const claimFields = [];

    for (let i = 0; i < claimContentArr.length; i++) {
      if (
        i === 0 ||
        /^一種/.test(claimContentArr[i]) ||
        /^(依據|根據|如|依)/.test(claimContentArr[i])
      ) {
        // console.log("new Claim: ", claimContentArr[i]);
        claimFields.push({ claimNum, content: [claimContentArr[i]] });
        claimNum++;
      } else {
        claimFields[claimFields.length - 1].content.push(claimContentArr[i]);
      }
    }

    // console.log("getClaims_v2~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    return claimFields;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export default getClaims;

export const generateErrorExp = (essentialData) => {
  if (
    essentialData.applicationNum[3] !== "1" &&
    /(方法|程序|流程|步驟)$/.test(essentialData.utilityModelTitle)
  ) {
    const message =
      "本案「新型名稱」含有方法、步驟、流程或類似用語，反映其申請標的非屬專利法第104條所規定對物品之形狀、構造或組合之創作。";
    essentialData.allErrors.title.push({ message });
    essentialData.allErrors_v2.law_104.push(message);
  }

  // descriptionOfElementMap
  const descriptionOfElementMapDuplicate = [];
  Object.keys(essentialData.descriptionOfElementMap).forEach((key) => {
    if (essentialData.descriptionOfElementMap[key].status === "key duplicate") {
      const first = `「${
        essentialData.descriptionOfElementMap[key].values[0]
      }（${key.slice(0, key.indexOf("_duplicate"))}）」`;
      const last = `「${
        essentialData.descriptionOfElementMap[
          key.slice(0, key.indexOf("_duplicate"))
        ].values[0]
      }（${key.slice(0, key.indexOf("_duplicate"))}）」`;
      essentialData.allErrors.descriptionOfElementMap.push({
        message: `本案「符號說明」所述之構件${first}其符號與「符號說明」所述之構件${last}重複，應予修正。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
      });
      descriptionOfElementMapDuplicate.push({ first, last });
    }
  });
  if (descriptionOfElementMapDuplicate.length > 0) {
    const message = `說明書之「符號說明」所述之構件其符號重複：${descriptionOfElementMapDuplicate
      .map(({ first, last }) => `${first}與${last}`)
      .join("；")}。【摘要、說明書及圖式其餘部分請一併確認及修正】`;
    essentialData.allErrors_v2.no_law.push(message);
  }

  // figureOfDrawingsMap
  const figureOfDrawingsMapDuplicate = [];
  const figureOfDrawingsInconsistent = [];
  Object.keys(essentialData.figureOfDrawingsMap).forEach((key) => {
    if (essentialData.figureOfDrawingsMap[key].status === "key duplicate") {
      const first = `「${
        essentialData.figureOfDrawingsMap[key].values[0]
      }（${key.slice(0, key.indexOf("_duplicate"))}）」`;
      const last = `「${
        essentialData.figureOfDrawingsMap[
          key.slice(0, key.indexOf("_duplicate"))
        ].values[0]
      }（${key.slice(0, key.indexOf("_duplicate"))}）」`;
      essentialData.allErrors.figureOfDrawingsMap.push({
        message: `本案「代表圖之符號簡單說明」所述之構件${first}其符號與「代表圖之符號簡單說明」所述之構件${last}重複，應予修正。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
      });
      figureOfDrawingsMapDuplicate.push({ first, last });
    }
    if (
      essentialData.figureOfDrawingsMap[key].status === "element inconsistent"
    ) {
      const figureEl = essentialData.figureOfDrawingsMap[key].values[0];
      const descriptionEl =
        essentialData.descriptionOfElementMap[key]?.values?.[0];
      if (figureEl && descriptionEl)
        figureOfDrawingsInconsistent.push({ key, figureEl, descriptionEl });
    }
  });
  if (figureOfDrawingsMapDuplicate.length > 0) {
    const message = `摘要之「代表圖之符號簡單說明」所述之構件其符號重複：${figureOfDrawingsMapDuplicate
      .map(({ first, last }) => `${first}與${last}`)
      .join("；")}。【摘要、說明書及圖式其餘部分請一併確認及修正】`;
    essentialData.allErrors_v2.no_law.push(message);
  }
  if (figureOfDrawingsInconsistent.length > 0) {
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第22條第1項規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」`,
      message: `摘要之【代表圖符號簡單說明】記載之${figureOfDrawingsInconsistent
        .map(({ key, figureEl }) => `「${figureEl}（${key}）」`)
        .join("、")}與說明書之【符號說明】記載之${figureOfDrawingsInconsistent
        .map(({ key, descriptionEl }) => `「${descriptionEl}（${key}）」`)
        .join("、")}，其用語不一致。`,
    });
  }

  // failedDescriptionOfElementMap
  const failedDescriptionOfElementMapArr = [];
  essentialData.failedDescriptionOfElementMap.forEach(({ num, el }) => {
    essentialData.allErrors.system.push({
      message: `本案「符號說明」第${
        num + 1
      }行所述之元件名稱及符號「${el}」系統無法判別，建議修正此元件後再重新分析。`,
    });
    failedDescriptionOfElementMapArr.push({ row: num + 1, el });
  });
  if (failedDescriptionOfElementMapArr.length > 0) {
    const message = `本案「符號說明」所述之元件名稱及符號系統無法判別，建議修正此元件後再重新分析：${failedDescriptionOfElementMapArr
      .map(({ row, el }) => `「${el}」（第${row}行）`)
      .join("；")}。`;
    essentialData.allErrors_v2.system_fail.push(message);
  }

  // failedFigureOfDrawingsMap
  const failedFigureOfDrawingsMapArr = [];
  essentialData.failedFigureOfDrawingsMap.forEach(({ num, el }) => {
    essentialData.allErrors.system.push({
      message: `本案「代表圖之符號簡單說明」第${
        num + 1
      }行所述之元件名稱及符號「${el}」系統無法判別，建議修正此元件後再重新分析。`,
    });
    failedFigureOfDrawingsMapArr.push({ row: num + 1, el });
  });
  if (failedFigureOfDrawingsMapArr.length > 0) {
    const message = `本案「代表圖之符號簡單說明」所述之元件名稱及符號系統無法判別，建議修正此元件後再重新分析：${failedFigureOfDrawingsMapArr
      .map(({ row, el }) => `「${el}」（第${row}行）`)
      .join("；")}。`;
    essentialData.allErrors_v2.system_fail.push(message);
  }

  // allDisclosureParagraphDetails -> paragraphMatch -> wrongs
  const disclosureKeyUnmatch = {};
  const disclosureNameUnmatch = {};
  const disclosureWrongWords = {};
  essentialData.allDisclosureParagraphDetails.forEach((para) => {
    const general = para.general;
    para.paragraphMatch.wrongs.forEach(
      ({ group, item, value, fullValue, wrongKeys }) => {
        const correctKeyInDescriptionOfElement =
          getKeyInDescriptionOfElementMapCorrect(essentialData, item, group);
        const correctKeyInFigureOfDrawingsMap =
          getKeyInFigureOfDrawingsMapCorrect(essentialData, item, group);
        const correctNameInDescriptionOfElementMap =
          getNameInDescriptionOfElementMapCorrect(essentialData, wrongKeys);
        const correctNameInFigureOfDrawingsMap =
          getNameInFigureOfDrawingsMapCorrect(essentialData, wrongKeys);

        if (
          correctKeyInDescriptionOfElement ||
          correctKeyInFigureOfDrawingsMap
        ) {
          // 元件名稱正確 符號錯誤
          let midMessage;
          if (
            correctKeyInDescriptionOfElement &&
            correctKeyInFigureOfDrawingsMap
          ) {
            midMessage = `，與「符號說明」及「代表圖之符號簡單說明」`;
          } else if (
            correctKeyInDescriptionOfElement &&
            !correctKeyInFigureOfDrawingsMap
          ) {
            midMessage = `，與「符號說明」`;
          } else {
            midMessage = `，與「代表圖之符號簡單說明」`;
          }
          const unMatch = `「${fullValue || value || item}（${wrongKeys
            .filter((k) => k !== "")
            .join("）、（")}）」`;
          const unMatchWith = `「${fullValue || value || item}　（${
            correctKeyInDescriptionOfElement || correctKeyInFigureOfDrawingsMap
          }）」`;
          essentialData.allErrors.allDisclosureParagraphDetails.push({
            message: `依專利法施行細則${
              essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
            }第22條第1項之規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案「說明書」之「${
              essentialData.applicationNum[3] === "1" ? "發明" : "新型"
            }內容」內容之記載未依前開規定之格式撰寫（段落編號【${general}】第　、　行 ／ 第　頁第　、　行之構件${unMatch}${midMessage}所述之構件${unMatchWith}，其符號不一致，應予修正。查違反專利法${
              essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
            }第26條第4項之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
          });
          if (!disclosureKeyUnmatch[`${unMatch}@@@${unMatchWith}`])
            disclosureKeyUnmatch[`${unMatch}@@@${unMatchWith}`] = [
              {
                unMatch,
                unMatchWith,
                general,
                unMatchMsg: midMessage.slice(2),
              },
            ];
          else
            disclosureKeyUnmatch[`${unMatch}@@@${unMatchWith}`].push({
              unMatch,
              unMatchWith,
              general,
              unMatchMsg: midMessage.slice(2),
            });
        } else if (
          correctNameInDescriptionOfElementMap ||
          correctNameInFigureOfDrawingsMap
        ) {
          // 符號正確  元件名稱錯誤
          let midMessage;
          if (
            correctNameInDescriptionOfElementMap &&
            correctNameInFigureOfDrawingsMap
          ) {
            midMessage = `，與「符號說明」及「代表圖之符號簡單說明」`;
          } else if (
            correctNameInDescriptionOfElementMap &&
            !correctNameInFigureOfDrawingsMap
          ) {
            midMessage = `，與「符號說明」`;
          } else {
            midMessage = `，與「代表圖之符號簡單說明」`;
          }
          const unMatch = `「${item}（${wrongKeys
            .filter((k) => k !== "")
            .join("）、（")}）」`;
          const unMatchWith = `「${
            correctNameInDescriptionOfElementMap ||
            correctNameInFigureOfDrawingsMap
          }　（${wrongKeys.filter((k) => k !== "").join("）、（")}）」`;
          essentialData.allErrors.allDisclosureParagraphDetails.push({
            message: `依專利法施行細則${
              essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
            }第22條第1項之規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案「說明書」之「${
              essentialData.applicationNum[3] === "1" ? "發明" : "新型"
            }內容」內容之記載未依前開規定之格式撰寫（段落編號【${general}】第　、　行 ／ 第　頁第　、　行之構件${unMatch}${midMessage}所述之構件${unMatchWith}，其名稱用語不一致，應予修正。查違反專利法${
              essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
            }第26條第4項之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
          });
          if (!disclosureNameUnmatch[`${unMatch}@@@${unMatchWith}`])
            disclosureNameUnmatch[`${unMatch}@@@${unMatchWith}`] = [
              {
                unMatch,
                unMatchWith,
                general,
                unMatchMsg: midMessage.slice(2),
              },
            ];
          else
            disclosureNameUnmatch[`${unMatch}@@@${unMatchWith}`].push({
              unMatch,
              unMatchWith,
              general,
              unMatchMsg: midMessage.slice(2),
            });
        }
      }
    );

    para.paragraphMatch.wrongWords.forEach(({ value }) => {
      essentialData.allErrors.allDisclosureParagraphDetails.push({
        message: `「說明書」之「新型內容」（段落編號【${general}】第　、　行 ／ 第　頁第　、　行）中，其所述之文字敘述「${value}」，應修正為「本創作」、「本新型」或其它屬新型之用語，應予修正。`,
      });
      if (!disclosureWrongWords[value]) disclosureWrongWords[value] = [general];
      else disclosureWrongWords[value].push(general);
    });
  });
  if (Object.keys(disclosureKeyUnmatch).length > 0) {
    const subMessageArr = Object.keys(disclosureKeyUnmatch)
      .map((key) => ({
        unMatch: disclosureKeyUnmatch[key][0].unMatch,
        unMatchWith: disclosureKeyUnmatch[key][0].unMatchWith,
        unMatchMsg: disclosureKeyUnmatch[key].every(
          ({ unMatchMsg }) => unMatchMsg === "「代表圖之符號簡單說明」"
        )
          ? "代表圖之符號簡單說明"
          : "符號說明",
        generals: disclosureKeyUnmatch[key].map(({ general }) => general),
      }))
      .map(
        ({ unMatch, unMatchWith, unMatchMsg, generals }) =>
          `${unMatch}（${generals
            .map((g) => `段落[${g}]第　行`)
            .join("、")}）與${unMatchWith}（${unMatchMsg}）`
      )
      .join("；");
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第22條第1項規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」`,
      message:
        `說明書之「${
          essentialData.applicationNum[3] === "1" ? "發明" : "新型"
        }內容」記載之符號不一致：` +
        subMessageArr +
        "。",
    });
  }
  if (Object.keys(disclosureNameUnmatch).length > 0) {
    const subMessageArr = Object.keys(disclosureNameUnmatch)
      .map((key) => ({
        unMatch: disclosureNameUnmatch[key][0].unMatch,
        unMatchWith: disclosureNameUnmatch[key][0].unMatchWith,
        unMatchMsg: disclosureNameUnmatch[key].every(
          ({ unMatchMsg }) => unMatchMsg === "「代表圖之符號簡單說明」"
        )
          ? "代表圖之符號簡單說明"
          : "符號說明",
        generals: disclosureNameUnmatch[key].map(({ general }) => general),
      }))
      .map(
        ({ unMatch, unMatchWith, unMatchMsg, generals }) =>
          `${unMatch}（${generals
            .map((g) => `段落[${g}]第　行`)
            .join("、")}）與${unMatchWith}（${unMatchMsg}）`
      )
      .join("；");
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第22條第1項規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」`,
      message:
        `說明書之「${
          essentialData.applicationNum[3] === "1" ? "發明" : "新型"
        }內容」記載之技術用語不一致：` +
        subMessageArr +
        "。",
    });
  }
  if (Object.keys(disclosureWrongWords).length > 0) {
    const subMessageArr = Object.keys(disclosureWrongWords)
      .map(
        (key) =>
          `「${key}」（` +
          Array.from(new Set(disclosureWrongWords[key]))
            .map((g) => `段落[${g}]第　行`)
            .join("、") +
          "）"
      )
      .join("；");
    essentialData.allErrors_v2.no_law.push(
      "說明書之「新型內容」，其所述之文字敘述" +
        subMessageArr +
        "，應修正為「本創作」、「本新型」或其它屬新型之用語。"
    );
  }

  // allModeForInventionParagraphDetails -> paragraphMatch -> wrong
  const modeForInventionKeyUnmatch = {};
  const modeForInventionNameUnmatch = {};
  const modeForInventionWrongWords = {};
  const modeForInventionFiguresErrors = {};
  essentialData.allModeForInventionParagraphDetails.forEach((para) => {
    const general = para.general;
    para.paragraphMatch.wrongs.forEach(
      ({ group, item, value, fullValue, wrongKeys }) => {
        const correctKeyInDescriptionOfElement =
          getKeyInDescriptionOfElementMapCorrect(essentialData, item, group);
        const correctKeyInFigureOfDrawingsMap =
          getKeyInFigureOfDrawingsMapCorrect(essentialData, item, group);
        const correctNameInDescriptionOfElementMap =
          getNameInDescriptionOfElementMapCorrect(essentialData, wrongKeys);
        const correctNameInFigureOfDrawingsMap =
          getNameInFigureOfDrawingsMapCorrect(essentialData, wrongKeys);

        if (
          correctKeyInDescriptionOfElement ||
          correctKeyInFigureOfDrawingsMap
        ) {
          // 元件名稱正確 符號錯誤
          let midMessage;
          if (
            correctKeyInDescriptionOfElement &&
            correctKeyInFigureOfDrawingsMap
          ) {
            midMessage = `，與「符號說明」及「代表圖之符號簡單說明」`;
          } else if (
            correctKeyInDescriptionOfElement &&
            !correctKeyInFigureOfDrawingsMap
          ) {
            midMessage = `，與「符號說明」`;
          } else {
            midMessage = `，與「代表圖之符號簡單說明」`;
          }
          const unMatch = `「${fullValue || value || item}（${wrongKeys
            .filter((k) => k !== "")
            .join("）、（")}）」`;
          const unMatchWith = `「${fullValue || value || item}（${
            correctKeyInDescriptionOfElement || correctKeyInFigureOfDrawingsMap
          }）」`;
          essentialData.allErrors.allModeForInventionParagraphDetails.push({
            message: `依專利法施行細則${
              essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
            }第22條第1項之規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案「說明書」之「實施方式」內容之記載未依前開規定之格式撰寫（段落編號【${general}】第　、　行 ／ 第　頁第　、　行之構件${unMatch}${midMessage}所述之構件${unMatchWith}，其符號不一致，應予修正。查違反專利法${
              essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
            }第26條第4項之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
          });
          if (!modeForInventionKeyUnmatch[`${unMatch}@@@${unMatchWith}`])
            modeForInventionKeyUnmatch[`${unMatch}@@@${unMatchWith}`] = [
              {
                unMatch,
                unMatchWith,
                general,
                unMatchMsg: midMessage.slice(2),
              },
            ];
          else
            modeForInventionKeyUnmatch[`${unMatch}@@@${unMatchWith}`].push({
              unMatch,
              unMatchWith,
              general,
              unMatchMsg: midMessage.slice(2),
            });
        } else if (
          correctNameInDescriptionOfElementMap ||
          correctNameInFigureOfDrawingsMap
        ) {
          // 符號正確  元件名稱錯誤
          let midMessage;
          if (
            correctNameInDescriptionOfElementMap &&
            correctNameInFigureOfDrawingsMap
          ) {
            midMessage = `，與「符號說明」及「代表圖之符號簡單說明」`;
          } else if (
            correctNameInDescriptionOfElementMap &&
            !correctNameInFigureOfDrawingsMap
          ) {
            midMessage = `，與「符號說明」`;
          } else {
            midMessage = `，與「代表圖之符號簡單說明」`;
          }
          const unMatch = `「${item}（${wrongKeys
            .filter((k) => k !== "")
            .join("）、（")}）」`;
          const unMatchWith = `「${
            correctNameInDescriptionOfElementMap ||
            correctNameInFigureOfDrawingsMap
          }（${wrongKeys.filter((k) => k !== "").join("）、（")}）」`;
          essentialData.allErrors.allModeForInventionParagraphDetails.push({
            message: `依專利法施行細則${
              essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
            }第22條第1項之規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案「說明書」之「實施方式」內容之記載未依前開規定之格式撰寫（段落編號【${general}】第　、　行 ／ 第　頁第　、　行之構件${unMatch}${midMessage}所述之構件${unMatchWith}，其名稱用語不一致，應予修正。查違反專利法${
              essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
            }第26條第4項之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
          });
          if (!modeForInventionNameUnmatch[`${unMatch}@@@${unMatchWith}`])
            modeForInventionNameUnmatch[`${unMatch}@@@${unMatchWith}`] = [
              {
                unMatch,
                unMatchWith,
                general,
                unMatchMsg: midMessage.slice(2),
              },
            ];
          else
            modeForInventionNameUnmatch[`${unMatch}@@@${unMatchWith}`].push({
              unMatch,
              unMatchWith,
              general,
              unMatchMsg: midMessage.slice(2),
            });
        }
      }
    );

    para.paragraphMatch.wrongWords.forEach(({ value }) => {
      essentialData.allErrors.allModeForInventionParagraphDetails.push({
        message: `「說明書」之「實施方式」（段落編號【${general}】第　、　行 ／ 第　頁第　、　行）中，其所述之文字敘述「${value}」，應修正為「本創作」、「本新型」或其它屬新型之用語，應予修正。`,
      });
      if (!modeForInventionWrongWords[value])
        modeForInventionWrongWords[value] = [general];
      else modeForInventionWrongWords[value].push(general);
    });

    para.paragraphMatch.figuresErrors.forEach(({ fig }) => {
      essentialData.allErrors.allModeForInventionParagraphDetails.push({
        message: `依專利法施行細則${
          essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
        }第17條第1項第6款規定，說明書之「實施方式」必須敘明：記載一個以上之實施方式，必要時得以實施例說明；有圖式者，應參照圖式加以說明。本案「實施方式」之記載未依前開規定之格式撰寫（段落[${general}]第　行所述之${fig}未揭露於圖式）。查違反專利法${
          essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
        }第26條第4項規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
      });
      if (!modeForInventionFiguresErrors[general])
        modeForInventionFiguresErrors[general] = [fig];
      else modeForInventionFiguresErrors[general].push(fig);
    });
  });
  if (Object.keys(modeForInventionKeyUnmatch).length > 0) {
    const subMessageArr = Object.keys(modeForInventionKeyUnmatch)
      .map((key) => ({
        unMatch: modeForInventionKeyUnmatch[key][0].unMatch,
        unMatchWith: modeForInventionKeyUnmatch[key][0].unMatchWith,
        unMatchMsg: modeForInventionKeyUnmatch[key].every(
          ({ unMatchMsg }) => unMatchMsg === "「代表圖之符號簡單說明」"
        )
          ? "代表圖之符號簡單說明"
          : "符號說明",
        generals: modeForInventionKeyUnmatch[key].map(({ general }) => general),
      }))
      .map(
        ({ unMatch, unMatchWith, unMatchMsg, generals }) =>
          `${unMatch}（${generals
            .map((g) => `段落[${g}]第　行`)
            .join("、")}）與${unMatchWith}（${unMatchMsg}）`
      )
      .join("；");
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第22條第1項規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」`,
      message: "說明書之「實施方式」記載之符號不一致：" + subMessageArr + "。",
    });
  }
  if (Object.keys(modeForInventionNameUnmatch).length > 0) {
    const subMessageArr = Object.keys(modeForInventionNameUnmatch)
      .map((key) => ({
        unMatch: modeForInventionNameUnmatch[key][0].unMatch,
        unMatchWith: modeForInventionNameUnmatch[key][0].unMatchWith,
        unMatchMsg: modeForInventionNameUnmatch[key].every(
          ({ unMatchMsg }) => unMatchMsg === "「代表圖之符號簡單說明」"
        )
          ? "代表圖之符號簡單說明"
          : "符號說明",
        generals: modeForInventionNameUnmatch[key].map(
          ({ general }) => general
        ),
      }))
      .map(
        ({ unMatch, unMatchWith, unMatchMsg, generals }) =>
          `${unMatch}（${generals
            .map((g) => `段落[${g}]第　行`)
            .join("、")}）與${unMatchWith}（${unMatchMsg}）`
      )
      .join("；");
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第22條第1項規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」`,
      message:
        "說明書之「實施方式」記載之技術用語不一致：" + subMessageArr + "。",
    });
  }
  if (Object.keys(modeForInventionWrongWords).length > 0) {
    const subMessageArr = Object.keys(modeForInventionWrongWords)
      .map(
        (key) =>
          `「${key}」（` +
          Array.from(new Set(modeForInventionWrongWords[key]))
            .map((g) => `段落[${g}]第　行`)
            .join("、") +
          "）"
      )
      .join("；");
    essentialData.allErrors_v2.no_law.push(
      "說明書之「實施方式」，其所述之文字敘述" +
        subMessageArr +
        "，應修正為「本創作」、「本新型」或其它屬新型之用語。"
    );
  }
  if (Object.keys(modeForInventionFiguresErrors).length > 0) {
    const subMessageArr = Object.keys(modeForInventionFiguresErrors)
      .map(
        (general) =>
          `段落[${general}]` +
          Array.from(new Set(modeForInventionFiguresErrors[general]))
            .map((fig) => `第　行所述之${fig}`)
            .join("、")
      )
      .join("；");
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第17條第1項第6款規定，說明書之「實施方式」必須敘明：記載一個以上之實施方式，必要時得以實施例說明；有圖式者，應參照圖式加以說明。`,
      message:
        "本案「實施方式」內容之記載未依前開規定之格式撰寫（未參照圖式加以說明：" +
        subMessageArr +
        "未揭露於圖式）。",
    });
  }

  // allClaimsDetails
  const claimErrors = {
    unknown: [],
    分析此請求項時發生問題: [],
    multi2multiRefErrors: [],
    invalidStarts: [],
    singleSentences: [],
    noBrackets: {},
    titleNoMatches: [],
    invalidAttaches: [],
    multi2multiNoSelects: [],
    不當依附: {},
    未揭示: {},
    compKeyUnmatch: {},
    compNameUnmatch: {},
    對應關係未敘明: {},
    invalidClaimTitle: [],
    請求項之標的名稱不相符: {},
  };
  essentialData.allClaimsDetails.forEach((claim) => {
    const num = claim.num;
    claim.errors.forEach(
      ({
        message,
        name,
        wrongKeys,
        mainElement,
        errorContent,
        otherMainElement,
        utilityModelTitle,
      }) => {
        if (!message) {
          return;
        }
        // system error
        if (claim.type === "unknown") {
          essentialData.allErrors.system.push({
            message: `本案「申請專利範圍」第${num}項的內容系統無法判別，建議修正此請求項後再重新分析。`,
          });
          claimErrors["unknown"].push(num);
          return;
        }
        if (message === "分析此請求項時發生問題") {
          essentialData.allErrors.system.push({
            message: `本案「申請專利範圍」第${num}項的內容系統分析此請求項時發生問題，建議修正此請求項後再重新分析。`,
          });
          claimErrors["分析此請求項時發生問題"].push(num);
          return;
        }

        try {
          if (
            /^本請求項所依附之請求項[0-9]+為多項附屬項[直間]接依附多項附屬項/.test(
              message
            )
          ) {
            essentialData.allErrors.allClaimsDetails.push({
              message: `依專利法施行細則${
                essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
              }第18條第5項之規定：「…。但多項附屬項間不得直接或間接依附。」本案「申請專利範圍」第${num}項內容之記載未依前開規定之格式撰寫（該項係為多項附屬項，依規定不得直接或間接依附於多項附屬項第${
                message.match(/[0-9]+/)[0]
              }項），應予修正。查違反專利法${
                essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
              }第26條第4項之規定。`,
            });
            claimErrors.multi2multiRefErrors.push(
              `請求項${num}（多項附屬項）直接或間接依附請求項${
                message.match(/[0-9]+/)[0]
              }（多項附屬項）。`
            );
          } else if (
            /不符合附屬項之記載形式/.test(message) ||
            message.startsWith("附屬項未以「如」、「依據」或「根據」等用語開頭")
          ) {
            essentialData.allErrors.allClaimsDetails.push({
              message: `申請專利範圍第${num}項（附屬項），其文字開頭應修正為「如申請專利範圍第X項所述之……」或「如請求項X所述之……」（其中X為阿拉伯數字），以符合附屬項之記載形式，應予修正。`,
            });
            claimErrors.invalidStarts.push(num);
          } else if (/^請求項未以單句為之/.test(message)) {
            essentialData.allErrors.allClaimsDetails.push({
              message: `依專利法施行細則${
                essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
              }第18條第6項之規定：「。獨立項或附屬項之文字敘述，應以單句為之」本案「申請專利範圍」第${num}項內容之記載未依前開規定之格式撰寫（${
                message.includes("句號在句中")
                  ? "於句中出現句點為不當之處"
                  : "文字敘述未以單句為之"
              }），應予修正。查違反專利法${
                essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
              }第26條第4項之規定。`,
            });
            claimErrors.singleSentences.push({
              num,
              msg: message.includes("句號在句中")
                ? "於句中出現句點為不當之處"
                : "文字敘述未以句點結束",
            });
          } else if (/的符號未置於括號內/.test(message)) {
            const name = `「${message.match(/「.*」/)[0].slice(1, -1)}」`;
            essentialData.allErrors.allClaimsDetails.push({
              message: `依專利法施行細則${
                essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
              }第19條第2項規定：「請求項之技術特徵得引用圖式中對應之符號，該符號應附加於對應之技術特徵後，並置於括號內；…。」本案「申請專利範圍」第${num}項第　行內容${name}之記載未依前開規定之格式撰寫（申請專利範圍之符號應全部引用並置於括號內或將申請專利範圍中之符號全數加以刪除），應予修正。查違反專利法${
                essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
              }第26條第4項之規定。`,
            });
            if (!claimErrors.noBrackets[name])
              claimErrors.noBrackets[name] = [num];
            else claimErrors.noBrackets[name].push(num);
          } else if (
            /^本請求項標的名稱「.+?」與所依附之請求項\([0-9]+\)之標的名稱「.+?」用語不一致/.test(
              message
            )
          ) {
            const elNames = [...message.matchAll(/「.+?」/g)].map((m) =>
              m[0].slice(1, -1)
            );
            const refClaimNum = message
              .match(/請求項\([0-9]+\)/)[0]
              .slice(4, -1);
            essentialData.allErrors.allClaimsDetails.push({
              message: `依專利法施行細則${
                essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
              }第22條第1項之規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案請求項第${num}項內容之記載未依前開規定之格式撰寫（該項所述標的名稱「${
                elNames[0]
              }」，與直接或間接依附之請求項第${refClaimNum}項標的名稱「${
                elNames[1]
              }」，其名稱用語不一致），應予修正。查違反專利法${
                essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
              }第26條第4項之規定。`,
            });
            claimErrors.titleNoMatches.push({
              num,
              prevNum: refClaimNum,
              name: elNames[0],
              prevName: elNames[1],
            });
          } else if (
            /^請求項[0-9]+即為本身，不可依附自己/.test(message) ||
            /^請求項[0-9]+不在該請求項之前或不存在/.test(message)
          ) {
            essentialData.allErrors.allClaimsDetails.push({
              message: `依專利法施行細則${
                essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
              }第18條第5項之規定：「附屬項僅得依附在前之獨立項或附屬項。…。」本案「申請專利範圍」第${num}項內容之記載未依前開規定之格式撰寫（該項所依附之申請專利範圍項號第${
                message.match(/[0-9]+/)[0]
              }項有誤），應予修正。查違反專利法${
                essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
              }第26條第4項之規定。`,
            });
            claimErrors.invalidAttaches.push(num);
          } else if (/^多項附屬項未以選擇式為之/.test(message)) {
            essentialData.allErrors.allClaimsDetails.push({
              message: `依專利法施行細則${
                essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
              }第18條第4項之規定：「依附於二項以上之附屬項為多項附屬項，應以選擇式為之。」本案「申請專利範圍」第${num}項內容之記載未依前開規定之格式撰寫（該項係為多項附屬項，未以選擇式為之），應予修正。查違反專利法${
                essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
              }第26條第4項之規定。`,
            });
            claimErrors.multi2multiNoSelects.push(num);
          } else if (/^元件名稱「.+?」未見於本請求項先前內容/.test(message)) {
            let dispMsg;
            const eln = message.match(/「.+?」/)[0].slice(1, -1);
            if (claim.type === "independent") {
              dispMsg = `申請專利範圍第${num}項（獨立項）第　行所述之構件「${eln}」，於該構件前之文字敘述未揭露該構件，應予修正。查違反專利法第112條第5款之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`;
              if (!claimErrors["未揭示"][num])
                claimErrors["未揭示"][num] = [eln];
              else claimErrors["未揭示"][num].push(eln);
            } else {
              const prevClaimNum = message
                .match(/\([0-9]+\)/)?.[0]
                .slice(1, -1);
              dispMsg = `依專利法施行細則${
                essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
              }第18條第1項之規定：「…。獨立項、附屬項，應以其依附關係，依序以阿拉伯數字編號排列。」本案「申請專利範圍」第${num}項內容之記載未依前開規定之格式撰寫（該項第　行所述之構件「${eln}」，於${
                prevClaimNum
                  ? "所依附申請專利範圍第" + prevClaimNum + "項中未揭示此構件"
                  : "該構件前之文字敘述未揭露該構件"
              }，係不當依附），應予修正。查違反專利法${
                essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
              }第26條第4項規定之規定。【摘要、說明書其餘部分請一併確認及修正】`;
              if (!claimErrors["不當依附"][num])
                claimErrors["不當依附"][num] = [
                  { name: eln, prevNum: prevClaimNum },
                ];
              else
                claimErrors["不當依附"][num].push({
                  name: eln,
                  prevNum: prevClaimNum,
                });
            }
            essentialData.allErrors.allClaimsDetails.push({
              message: dispMsg,
            });
          } else if (/^「.+?」的元件名稱或符號錯誤/.test(message)) {
            const correctKeyInDescriptionOfElement =
              getKeyInDescriptionOfElementMapCorrect(
                essentialData,
                name,
                "abc"
              );
            const correctKeyInFigureOfDrawingsMap =
              getKeyInFigureOfDrawingsMapCorrect(essentialData, name, "abc");
            const correctNameInDescriptionOfElementMap =
              getNameInDescriptionOfElementMapCorrect(essentialData, wrongKeys);
            const correctNameInFigureOfDrawingsMap =
              getNameInFigureOfDrawingsMapCorrect(essentialData, wrongKeys);
            let eln = message.match(/「.+?」/)[0].slice(1, -1);
            eln = eln.slice(0, eln.indexOf("（"));

            if (
              correctKeyInDescriptionOfElement ||
              correctKeyInFigureOfDrawingsMap
            ) {
              // 元件名稱正確 符號錯誤

              let midMessage;
              if (
                correctKeyInDescriptionOfElement &&
                correctKeyInFigureOfDrawingsMap
              ) {
                midMessage = `，與「符號說明」及「代表圖之符號簡單說明」`;
              } else if (
                correctKeyInDescriptionOfElement &&
                !correctKeyInFigureOfDrawingsMap
              ) {
                midMessage = `，與「符號說明」`;
              } else {
                midMessage = `，與「代表圖之符號簡單說明」`;
              }
              const unMatch = `「${eln}（${wrongKeys
                .filter((k) => k !== "")
                .join("）、（")}）」`;
              const unMatchWith = `「${name}（${
                correctKeyInDescriptionOfElement ||
                correctKeyInFigureOfDrawingsMap
              }）」`;
              essentialData.allErrors.allClaimsDetails.push({
                message: `依專利法施行細則${
                  essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
                }第22條第1項之規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案「申請專利範圍」第${num}項內容之記載未依前開規定之格式撰寫（該項第　行所述之構件${unMatch}${midMessage}所述之構件${unMatchWith}，其符號不一致，應予修正。查違反專利法${
                  essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
                }第26條第4項之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
              });
              if (!claimErrors.compKeyUnmatch[`${unMatch}@@@${unMatchWith}`])
                claimErrors.compKeyUnmatch[`${unMatch}@@@${unMatchWith}`] = [
                  {
                    unMatch,
                    unMatchWith,
                    num,
                    unMatchMsg: midMessage.slice(2),
                  },
                ];
              else
                claimErrors.compKeyUnmatch[`${unMatch}@@@${unMatchWith}`].push({
                  unMatch,
                  unMatchWith,
                  num,
                  unMatchMsg: midMessage.slice(2),
                });
            } else if (
              correctNameInDescriptionOfElementMap ||
              correctNameInFigureOfDrawingsMap
            ) {
              // 符號正確  元件名稱錯誤
              let midMessage;
              if (
                correctNameInDescriptionOfElementMap &&
                correctNameInFigureOfDrawingsMap
              ) {
                midMessage = `，與「符號說明」及「代表圖之符號簡單說明」`;
              } else if (
                correctNameInDescriptionOfElementMap &&
                !correctNameInFigureOfDrawingsMap
              ) {
                midMessage = `，與「符號說明」`;
              } else {
                midMessage = `，與「代表圖之符號簡單說明」`;
              }
              const unMatch = `「${eln}（${wrongKeys
                .filter((k) => k !== "")
                .join("）、（")}）」`;
              const unMatchWith = `「${
                correctNameInDescriptionOfElementMap ||
                correctNameInFigureOfDrawingsMap
              }（${wrongKeys.filter((k) => k !== "").join("）、（")}）」`;
              essentialData.allErrors.allClaimsDetails.push({
                message: `依專利法施行細則${
                  essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
                }第22條第1項之規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案「申請專利範圍」第${num}項內容之記載未依前開規定之格式撰寫（該項第　行所述之構件${unMatch}${midMessage}所述之構件${unMatchWith}，其名稱用語不一致，應予修正。查違反專利法${
                  essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
                }第26條第4項之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
              });
              if (!claimErrors.compNameUnmatch[`${unMatch}@@@${unMatchWith}`])
                claimErrors.compNameUnmatch[`${unMatch}@@@${unMatchWith}`] = [
                  {
                    unMatch,
                    unMatchWith,
                    num,
                    unMatchMsg: midMessage.slice(2),
                  },
                ];
              else
                claimErrors.compNameUnmatch[`${unMatch}@@@${unMatchWith}`].push(
                  {
                    unMatch,
                    unMatchWith,
                    num,
                    unMatchMsg: midMessage.slice(2),
                  }
                );
            }
          } else if (/^主要構件「.+?」，未記載與其他主要構件/.test(message)) {
            essentialData.allErrors.allClaimsDetails.push({
              message: `申請專利範圍第${num}項（獨立項）第　、　行所述之構件「${mainElement}」，未記載與其他構件「${otherMainElement.join(
                "」、「"
              )}」之連結或其對應關係，應予修正。查違反專利法第112條第5款之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
            });
            if (!claimErrors["對應關係未敘明"][num])
              claimErrors["對應關係未敘明"][num] = [mainElement];
            else claimErrors["對應關係未敘明"][num].push(mainElement);
          } else if (
            /係為(方法|程序|流程|步驟)，不符新型標的之規定/.test(message)
          ) {
            essentialData.allErrors.allClaimsDetails.push({
              message: `申請專利範圍第${num}項（獨立項）請求之標的係為${errorContent}，非屬物品之形狀、構造或組合者，不符新型標的之規定，應予修正。查違反專利法第104條之規定。【摘要、說明書及圖式其餘部分請一併確認及修正】`,
            });
            claimErrors.invalidClaimTitle.push(num);
          } else if (
            /^標的名稱「.+?」與專利名稱「.+?」用語不相符/.test(message)
          ) {
            // console.log("message: ", message, ", mainElement: ", mainElement);
            // debugger;
            if (
              essentialData.allErrors.allClaimsDetails.find(
                (claimErr) =>
                  claimErr.mainElement === mainElement &&
                  claimErr.utilityModelTitle === utilityModelTitle
              )
            ) {
              const claimErrIdx =
                essentialData.allErrors.allClaimsDetails.findIndex(
                  (claimErr) =>
                    claimErr.mainElement === mainElement &&
                    claimErr.utilityModelTitle === utilityModelTitle
                );
              const claimErrorCtx =
                essentialData.allErrors.allClaimsDetails[claimErrIdx];
              essentialData.allErrors.allClaimsDetails[claimErrIdx] = {
                ...claimErrorCtx,
                claims: [...claimErrorCtx.claims, num],
                message: generateInvalidMainElementMessage(
                  mainElement,
                  utilityModelTitle,
                  [...claimErrorCtx.claims, num],
                  essentialData.applicationNum[3] === "1"
                ),
              };
            } else {
              essentialData.allErrors.allClaimsDetails.push({
                mainElement,
                utilityModelTitle,
                claims: [num],
                message: generateInvalidMainElementMessage(
                  mainElement,
                  utilityModelTitle,
                  [num],
                  essentialData.applicationNum[3] === "1"
                ),
              });
            }

            if (!claimErrors["請求項之標的名稱不相符"][mainElement])
              claimErrors["請求項之標的名稱不相符"][mainElement] = [num];
            else claimErrors["請求項之標的名稱不相符"][mainElement].push(num);
          }
        } catch (e) {
          console.log("產生分析結果時發生問題", e.message);
          return;
        }
      }
    );
  });
  if (claimErrors.unknown.length > 0) {
    essentialData.allErrors_v2.system_fail.push(
      `本案「申請專利範圍」第${claimErrors.unknown.join(
        "、"
      )}項的內容系統無法判別，建議修正此請求項後再重新分析。`
    );
  }
  if (claimErrors["分析此請求項時發生問題"].length > 0) {
    essentialData.allErrors_v2.system_fail.push(
      `本案「申請專利範圍」第${claimErrors["分析此請求項時發生問題"].join(
        "、"
      )}項的內容分析時發生問題，建議修正此請求項後再重新分析。`
    );
  }
  if (claimErrors.multi2multiRefErrors.length > 0) {
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第18條第5項後段規定：「但多項附屬項間不得直接或間接依附。」本案下列所述多項附屬項間之依附方式不符前開規定。`,
      message: claimErrors.multi2multiRefErrors.join("、"),
    });
  }
  if (claimErrors.invalidStarts.length > 0) {
    essentialData.allErrors_v2.no_law.push(
      `申請專利範圍第${claimErrors.invalidStarts.join(
        "、"
      )}項（附屬項），其文字開頭應修正為「如申請專利範圍第X項所述之……」或「如請求項X所述之……」（其中X為阿拉伯數字），以符合附屬項之記載形式，應予修正。`
    );
  }
  if (claimErrors.singleSentences.length > 0) {
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第18條第6項規定：「獨立項或附屬項之文字敘述，應以單句為之。」`,
      message:
        "本案請求項未依前開規定之格式撰寫：" +
        claimErrors.singleSentences
          .map(({ num, msg }) => `請求項${num}（${msg}）`)
          .reduce((acc, cur, idx, prev) => {
            if (prev.indexOf(cur) === idx) acc.push(cur);
            return acc;
          }, [])
          .join("、") +
        "。",
    });
  }
  if (Object.keys(claimErrors.noBrackets).length > 0) {
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第19條第2項規定：「請求項之技術特徵得引用圖式中對應之符號，該符號應附加於對應之技術特徵後，並置於括號內；……。」`,
      message:
        "本案請求項未依前開規定之格式撰寫（申請專利範圍之符號應全部引用並置於括號內或將全數請求項之符號全數加以刪除）：" +
        Object.keys(claimErrors.noBrackets)
          .map(
            (name) =>
              `${name}（` +
              Array.from(new Set(claimErrors.noBrackets[name]))
                .map((num) => `請求項${num}第　行`)
                .join("、") +
              "）"
          )
          .join("；") +
        "引用符號未置於括號內。",
    });
  }
  if (claimErrors.titleNoMatches.length > 0) {
    claimErrors.titleNoMatches.forEach(({ num, prevNum, name, prevName }) =>
      essentialData.allErrors_v2.law_112_3.push({
        prefix: `依專利法施行細則${
          essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
        }第22條第1項規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」`,
        message: `本案請求項${num}所述標的名稱「${name}」，與直接或間接依附之請求項${prevNum}所述標的名稱「${prevName}」，其名稱用語不一致。`,
      })
    );
  }
  if (claimErrors.invalidAttaches.length > 0) {
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第18條第5項前段規定：「附屬項僅得依附在前之獨立項或附屬項。」`,
      message:
        "本案請求項" +
        claimErrors.invalidAttaches.join("、") +
        "未依前開規定依附在前之獨立項或附屬項。",
    });
  }
  if (claimErrors.multi2multiNoSelects.length > 0) {
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第18條第4項規定：「依附於二項以上之附屬項為多項附屬項，應以選擇式為之。」`,
      message:
        "本案請求項" +
        claimErrors.multi2multiNoSelects.join("、") +
        "係為多項附屬項，未以選擇式為之。",
    });
  }
  if (Object.keys(claimErrors["未揭示"]).length > 0) {
    Object.keys(claimErrors["未揭示"]).forEach((num) =>
      essentialData.allErrors_v2.law_112_5.push({
        prefix: "",
        message:
          `請求項${num}（獨立項）所述之技術特徵` +
          claimErrors["未揭示"][num]
            .map((name) => `「${name}」（第　行）`)
            .reduce((acc, cur, idx, prev) => {
              if (prev.indexOf(cur) === idx) acc.push(cur);
              return acc;
            }, [])
            .join("、") +
          "，於該技術特徵前之文字敘述未揭示【全案所述相關技術內容，請一併檢視確認或修正】。",
      })
    );
  }
  if (Object.keys(claimErrors["不當依附"]).length > 0) {
    Object.keys(claimErrors["不當依附"]).forEach((num) => {
      if (claimErrors["不當依附"][num][0].prevNum) {
        essentialData.allErrors_v2.law_112_3.push({
          prefix: `依專利法施行細則${
            essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
          }第18條第1項後段規定：「獨立項、附屬項，應以其依附關係，依序以阿拉伯數字編號排列。」下列請求項間之依附關係不符前開規定。`,
          message:
            `本案請求項${num}所述之` +
            claimErrors["不當依附"][num]
              .map(({ name }) => `「${name}」（第　行）`)
              .reduce((acc, cur, idx, prev) => {
                if (prev.indexOf(cur) === idx) acc.push(cur);
                return acc;
              }, [])
              .join("、") +
            `，於所依附請求項${claimErrors["不當依附"][num][0].prevNum}中未揭示。`,
        });
      }
    });
  }
  if (Object.keys(claimErrors.compNameUnmatch).length > 0) {
    const subMessageArr = Object.keys(claimErrors.compNameUnmatch)
      .map((key) => ({
        unMatch: claimErrors.compNameUnmatch[key][0].unMatch,
        unMatchWith: claimErrors.compNameUnmatch[key][0].unMatchWith,
        unMatchMsg: claimErrors.compNameUnmatch[key].every(
          ({ unMatchMsg }) => unMatchMsg === "「代表圖之符號簡單說明」"
        )
          ? "代表圖之符號簡單說明"
          : "符號說明",
        nums: claimErrors.compNameUnmatch[key].map(({ num }) => num),
      }))
      .map(
        ({ unMatch, unMatchWith, unMatchMsg, nums }) =>
          `${unMatch}（${nums
            .map((g) => `請求項${g}第　行`)
            .join("、")}）與${unMatchWith}（${unMatchMsg}）`
      )
      .join("；");
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第22條第1項規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案有下列技術用語或符號不一致，不符上開規定。`,
      message:
        "「申請專利範圍」與說明書記載之用語不一致：" + subMessageArr + "。",
    });
  }
  if (Object.keys(claimErrors.compKeyUnmatch).length > 0) {
    const subMessageArr = Object.keys(claimErrors.compKeyUnmatch)
      .map((key) => ({
        unMatch: claimErrors.compKeyUnmatch[key][0].unMatch,
        unMatchWith: claimErrors.compKeyUnmatch[key][0].unMatchWith,
        unMatchMsg: claimErrors.compKeyUnmatch[key].every(
          ({ unMatchMsg }) => unMatchMsg === "「代表圖之符號簡單說明」"
        )
          ? "代表圖之符號簡單說明"
          : "符號說明",
        nums: claimErrors.compKeyUnmatch[key].map(({ num }) => num),
      }))
      .map(
        ({ unMatch, unMatchWith, unMatchMsg, nums }) =>
          `${unMatch}（${nums
            .map((g) => `請求項${g}第　行`)
            .join("、")}）與${unMatchWith}（${unMatchMsg}）`
      )
      .join("；");
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第22條第1項規定：「說明書、申請專利範圍及摘要中之技術用語及符號應一致。」本案有下列技術用語或符號不一致，不符上開規定。`,
      message:
        "「申請專利範圍」與說明書記載之符號不一致：" + subMessageArr + "。",
    });
  }
  if (Object.keys(claimErrors["對應關係未敘明"]).length > 0) {
    Object.keys(claimErrors["對應關係未敘明"]).forEach((num) =>
      essentialData.allErrors_v2.law_112_5.push({
        prefix: "",
        message:
          `請求項${num}（獨立項）所述之技術特徵包含` +
          claimErrors["對應關係未敘明"][num]
            .map((mainElement) => `「${mainElement}」（第　行）`)
            .join("、") +
          `等構件，惟該些構件於空間上的安排、配置、連結或其對應關係未敘明，係${
            essentialData.applicationNum[3] === "1" ? "發明" : "新型"
          }結構特徵揭露明顯不清楚【說明書及圖式應記載獨立項所述構件及其連結關係，請一併檢視確認或修正】。`,
      })
    );
  }
  if (claimErrors.invalidClaimTitle.length > 0) {
    essentialData.allErrors_v2.law_104.push(
      `本案請求項${claimErrors.invalidClaimTitle.join(
        "、"
      )}之標的名稱含有方法、步驟、流程或類似用語，反映其申請標的非屬專利法第104條所規定對物品之形狀、構造或組合之創作。`
    );
  }
  if (Object.keys(claimErrors["請求項之標的名稱不相符"]).length > 0) {
    essentialData.allErrors_v2.law_112_3.push({
      prefix: `依專利法施行細則${
        essentialData.applicationNum[3] === "1" ? "" : "第45條準用"
      }第17條第4項規定：${
        essentialData.applicationNum[3] === "1" ? "發明" : "新型"
      }名稱，應簡明表示所申請${
        essentialData.applicationNum[3] === "1" ? "發明" : "新型"
      }之內容，不得冠以無關之文字。`,
      message:
        `本案${
          essentialData.applicationNum[3] === "1" ? "發明" : "新型"
        }名稱「${essentialData.utilityModelTitle}」與` +
        Object.keys(claimErrors["請求項之標的名稱不相符"])
          .map(
            (mainElement) =>
              `請求項${claimErrors["請求項之標的名稱不相符"][mainElement].join(
                "、"
              )}之標的名稱「${mainElement}」`
          )
          .join("、") +
        `，其範疇內容不相符（${
          essentialData.applicationNum[3] === "1" ? "發明" : "新型"
        }名稱未能表示所申請${
          essentialData.applicationNum[3] === "1" ? "發明" : "新型"
        }之內容）。`,
    });
  }
  /** reconstructure error */
  essentialData.allErrors_v2.structuredResult = {
    system_fail: essentialData.allErrors_v2.system_fail,
    no_law: essentialData.allErrors_v2.no_law,
    law_104: essentialData.allErrors_v2.law_104,
    law_112_3: {
      lawBody: `揭露方式違反專利法${
        essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
      }第26條第4項規定。【摘要、說明書、申請專利範圍及圖式其餘部分請一併確認及修正】`,
      lawBodyEnd: `查違反專利法${
        essentialData.applicationNum[3] === "1" ? "" : "第120條準用"
      }第26條第4項規定。【摘要、說明書、申請專利範圍及圖式其餘部分請一併確認及修正】`,
      children: reConstructureLaw(essentialData.allErrors_v2.law_112_3),
    },
    law_112_5: {
      lawBody: `本案有未揭露必要事項，或其揭露不清楚情事，查違反專利法第112條第5款規定。`,
      lawBodyEnd: `查違反專利法第112條第5款規定。`,
      children: reConstructureLaw(essentialData.allErrors_v2.law_112_5),
      // children: [
      //   ...reConstructureLaw(essentialData.allErrors_v2.law_112_5),
      //   ...reConstructureLaw(essentialData.allErrors_v2.law_112_5),
      // ],
    },
  };
  console.log(essentialData.allErrors_v2.structuredResult);

  /** removeRepeatedMessage */
  Object.keys(essentialData.allErrors).forEach((errType) => {
    essentialData.allErrors[errType] = removeRepeatedMessage(
      essentialData.allErrors[errType]
    );
  });
}; // generateErrorExp

const reConstructureLaw = (laws) => {
  if (!laws) return [];
  const result = []; // [{prefix: "...", children: ["...", "..."]}]
  for (let law of laws) {
    const resultIdx = result.findIndex((r) => r.prefix === law.prefix);
    if (resultIdx === -1) {
      result.push({
        prefix: law.prefix,
        children: [law.message],
      });
    } else {
      result[resultIdx].children.push(law.message);
    }
  }
  return result;
};

const removeRepeatedMessage = (data) => {
  return data.reduce((acc, cur) => {
    if (acc.map(({ message }) => message).includes(cur.message)) {
      return acc;
    }
    return [...acc, { message: cur.message }];
  }, []);
};

const getKeyInDescriptionOfElementMapCorrect = (essentialData, item, group) => {
  // get the key corresponds to the correct element name
  return Object.keys(essentialData.descriptionOfElementMap).find(
    (key) =>
      essentialData.descriptionOfElementMap[key].id === group ||
      essentialData.descriptionOfElementMap[key].values[0] === item
  );
};

const getKeyInFigureOfDrawingsMapCorrect = (essentialData, item, group) => {
  // get the key corresponds to the correct element name
  return Object.keys(essentialData.figureOfDrawingsMap).find(
    (key) =>
      essentialData.figureOfDrawingsMap[key].id === group ||
      essentialData.figureOfDrawingsMap[key].values[0] === item
  );
};

const getNameInDescriptionOfElementMapCorrect = (essentialData, wrongKeys) => {
  // get the element name corresponds to the correct key
  for (let key of wrongKeys) {
    if (essentialData.descriptionOfElementMap[key]) {
      return essentialData.descriptionOfElementMap[key].values[0];
    }
  }
  return undefined;
};

const getNameInFigureOfDrawingsMapCorrect = (essentialData, wrongKeys) => {
  // get the element name corresponds to the correct key
  for (let key of wrongKeys) {
    if (essentialData.figureOfDrawingsMap[key]) {
      return essentialData.figureOfDrawingsMap[key].values[0];
    }
  }
  return undefined;
};

const generateInvalidMainElementMessage = (
  mainElement,
  utilityModelTitle,
  claimNums,
  isInvention
) => {
  let prevClaimNum = claimNums.shift();
  const rangeSets = [{ from: prevClaimNum }];

  while (claimNums.length > 0) {
    const currentClaimNum = claimNums.shift();
    if (currentClaimNum - 1 === prevClaimNum) {
      rangeSets[rangeSets.length - 1].to = currentClaimNum;
    } else {
      rangeSets.push({
        from: currentClaimNum,
      });
    }
    prevClaimNum = currentClaimNum;
  }

  const rangeText = [];
  rangeSets.forEach((r) => {
    if (r.to !== undefined) {
      rangeText.push(`第${r.from}至${r.to}項`);
    } else {
      rangeText.push(`第${r.from}項`);
    }
  });

  return `依專利法施行細則${
    isInvention ? "" : "第45條準用"
  }第17條第4項之規定：「發明名稱，應簡明表示所申請發明之內容，不得冠以無關之文字。」本案${
    isInvention ? "發明" : "新型"
  }名稱「${utilityModelTitle}」內容之記載未依前開規定之格式撰寫（${
    isInvention ? "發明" : "新型"
  }名稱「${utilityModelTitle}」與申請專利範圍${rangeText.join(
    "、"
  )}所述標的名稱「${mainElement}」，其名稱用語不相符），應予修正。查違反專利法${
    isInvention ? "" : "第120條準用"
  }第26條第4項之規定。【摘要、說明書其餘部分請一併確認及修正】`;
};

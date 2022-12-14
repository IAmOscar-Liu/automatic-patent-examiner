import { useEffect } from "react";
import { processAbstract } from "../utils/processAbstract";
import { processData } from "../utils/processData";
import { checkFigureOfDrawings } from "../utils/checkFigureOfDrawings";
import { buildElementColorMap } from "../utils/buildElementColorMap";
import { modifyAllParagraph } from "../utils/modifyAllParagraph";
import { modifyAllClaims } from "../utils/modifyAllClaims";
import { processTFAndBA } from "../utils/processTFAndBA";
import { generateErrorExp } from "../utils/generateErrorExp";
import { checkDrawings } from "../utils/checkDrawings";

export const useInit = (
  XMLData,
  setXMLData,
  _essentialData,
  setEssentialData,
  setAllUpdateDisclosureParagraph,
  setAllUpdateModeForInventionParagraph,
  setAllUpdateClaimParagraph
) => {
  useEffect(() => {
    if (!_essentialData.isProcessing && XMLData.isLoading) {
      console.log(`reset everything ${new Date().toString().slice(16, 24)}`);
      setEssentialData((prev) => ({
        ...prev,
        isProcessing: true,
        applicationNum: "",
        utilityModelTitle: "",
        utilityModelTitleEn: "",
        technicalField: [],
        backgroundArt: [],
        abstractContent: [],
        abstractContentEn: [],
        descriptionOfElementMap: {},
        figureOfDrawingsMap: {},
        failedDescriptionOfElementMap: [],
        failedFigureOfDrawingsMap: [],
        elementColorMap: {},
        allAbstractParagraphDetails: [],
        allTechnicalFieldParagraphDetails: [],
        allBackgroundArtParagraphDetails: [],
        allDisclosureParagraphDetails: [],
        allModeForInventionParagraphDetails: [],
        allClaimsDetails: [],
        allDrawings: [],
        allDrawingsDescription: [],
        missingData: [],
        claimPayload: [],
        preserveValues: [],
        searchString: "",
        allErrors: {
          title: [],
          descriptionOfElementMap: [],
          figureOfDrawingsMap: [],
          allDisclosureParagraphDetails: [],
          allModeForInventionParagraphDetails: [],
          allClaimsDetails: [],
          system: []
        },
        globalHighlightOn: true,
        globalHighlightElement: [],
        synchronizeHighlight: false
      }));
      setAllUpdateDisclosureParagraph([]);
      setAllUpdateModeForInventionParagraph([]);
      setAllUpdateClaimParagraph([]);
    }

    if (!XMLData.isLoading) {
      const isDataCompleted =
        Object.keys(XMLData.abstractData).length !== 0 &&
        Object.keys(XMLData.descriptionOfElementData).length !== 0 &&
        Object.keys(XMLData.figureDrawingsData).length !== 0 &&
        Object.keys(XMLData.disclosureData).length !== 0 &&
        Object.keys(XMLData.modeForInventionData).length !== 0 &&
        Object.keys(XMLData.claimsData).length !== 0;

      if (isDataCompleted) {
        // ??? xml ???????????????
        // Deep copy essentialData to make it easy to be modified
        const essentialData = JSON.parse(JSON.stringify(_essentialData));
        console.log(`Get Started ${new Date().toString().slice(16, 24)}`);

        // utilityModelTitle: "",
        // utilityModelTitleEn: "",
        // utilityModelTitleData: "",
        //utilityModelTitleDataEn: "",
        essentialData.applicationNum = XMLData.applicationNum;
        essentialData.utilityModelTitle = XMLData.utilityModelTitleData;
        essentialData.utilityModelTitleEn = XMLData.utilityModelTitleDataEn;

        processAbstract(XMLData.abstractData, essentialData);
        processAbstract(XMLData.abstractDataEn, essentialData);

        processTFAndBA(
          XMLData.technicalFieldData,
          essentialData,
          "technical-field"
        );
        processTFAndBA(
          XMLData.backgroundArtData,
          essentialData,
          "background-art"
        );

        processData(
          XMLData.descriptionOfElementData,
          "description-of-element",
          essentialData,
          null,
          null
        );
        processData(
          XMLData.figureDrawingsData,
          "figure-drawings",
          essentialData,
          null,
          null
        );
        // show warning message
        if (
          essentialData.failedDescriptionOfElementMap.length > 0 ||
          essentialData.failedFigureOfDrawingsMap.length > 0
        ) {
          window.alert(
            "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????"
          );
        }
        checkFigureOfDrawings(essentialData);
        buildElementColorMap(essentialData);

        // console.log(essentialData);
        // debugger;

        checkDrawings(
          XMLData.drawingsData,
          XMLData.drawingsDescriptionData,
          essentialData
        );

        // allAbstractParagraphDetails: [],
        modifyAllParagraph(
          XMLData.abstractData,
          "allAbstractParagraphDetails",
          -1,
          essentialData,
          null
        );

        // allTechnicalFieldParagraphDetails: [],
        modifyAllParagraph(
          XMLData.technicalFieldData,
          "allTechnicalFieldParagraphDetails",
          -1,
          essentialData,
          null
        );

        // allBackgroundArtParagraphDetails: [],
        modifyAllParagraph(
          XMLData.backgroundArtData,
          "allBackgroundArtParagraphDetails",
          -1,
          essentialData,
          null
        );

        modifyAllParagraph(
          XMLData.modeForInventionData,
          "allModeForInventionParagraphDetails",
          -1,
          essentialData,
          null
        );
        modifyAllParagraph(
          XMLData.disclosureData,
          "allDisclosureParagraphDetails",
          -1,
          essentialData,
          null
        ); // in Reactjs, pass essentialData and setEssentialData

        modifyAllClaims(XMLData.claimsData, -1, essentialData, null, []);
        // ??????????????????
        generateErrorExp(essentialData);

        // For Test
        // console.log("Abstract", essentialData.abstractContent.join("\n"));
        console.log(
          "descriptionOfElementMap",
          essentialData.descriptionOfElementMap
        );
        console.log("figureOfDrawingsMap", essentialData.figureOfDrawingsMap);
        console.log(
          "failedDescriptionOfElementMap",
          essentialData.failedDescriptionOfElementMap
        );
        console.log(
          "failedFigureOfDrawingsMap",
          essentialData.failedFigureOfDrawingsMap
        );

        // allAbstractParagraphDetails: []
        console.log(
          "allAbstractParagraphDetails",
          essentialData.allAbstractParagraphDetails
        );
        // allTechnicalFieldParagraphDetails: [],
        console.log(
          "allTechnicalFieldParagraphDetails",
          essentialData.allTechnicalFieldParagraphDetails
        );
        // allBackgroundArtParagraphDetails: [],
        console.log(
          "allBackgroundArtParagraphDetails",
          essentialData.allBackgroundArtParagraphDetails
        );

        console.log(
          "allDisclosureParagraphDetails",
          essentialData.allDisclosureParagraphDetails
        );
        console.log(
          "allModeForInventionParagraphDetails",
          essentialData.allModeForInventionParagraphDetails
        );
        console.log("elementColorMap", essentialData.elementColorMap);
        console.log("allClaimsDetails", essentialData.allClaimsDetails);
        console.log("allErrors", essentialData.allErrors);
        // For Test Ene

        console.log(`Write new data ${new Date().toString().slice(16, 24)}`);
        setEssentialData({
          ...essentialData,
          isProcessing: false,
          // utilityModelTitle: XMLData.utilityModelTitleData,
          // utilityModelTitleEn: XMLData.utilityModelTitleDataEn,
          dragAreaMsg: `????????????${XMLData.fileName.slice(
            6
          )}????????????????????????????????????????????????????????????`
        });
      } else if (!isDataCompleted && XMLData.fileName !== "") {
        // ??? xml ??????????????????
        console.log(`sth missing... ${new Date().toString().slice(16, 24)}`);
        let missingData = [];
        if (Object.keys(XMLData.abstractData).length === 0) {
          missingData.push("??????(abstract)");
        }
        if (Object.keys(XMLData.descriptionOfElementData).length === 0) {
          missingData.push("????????????(description-of-element)");
        }
        if (Object.keys(XMLData.figureDrawingsData).length === 0) {
          missingData.push("??????????????????????????????(figure-drawings)");
        }
        if (Object.keys(XMLData.disclosureData).length === 0) {
          missingData.push("????????????(disclosure)");
        }
        if (Object.keys(XMLData.modeForInventionData).length === 0) {
          missingData.push("????????????(mode-for-invention)");
        }
        if (Object.keys(XMLData.claimsData).length === 0) {
          missingData.push("?????????(claims)");
        }
        const dragAreaMsg = XMLData.isXMLFormatOK
          ? `?????????????????????${XMLData.fileName.slice(
              6
            )}??????????????????????????????????????????`
          : "???XML???????????????????????????????????????????????????????????????";
        window.alert(
          XMLData.isXMLFormatOK
            ? `????????????${XMLData.fileName.slice(
                6
              )}??????????????????????????????????????????????????????????????????`
            : dragAreaMsg
        );
        setEssentialData((prev) => ({
          ...prev,
          isProcessing: false,
          missingData,
          dragAreaMsg
        }));
      }
    }
  }, [XMLData]);

  return null;
};

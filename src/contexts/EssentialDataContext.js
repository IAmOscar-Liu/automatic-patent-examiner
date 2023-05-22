import React, { createContext, useState } from "react";

export const EssentialDataContextProvider = createContext();

const EssentialDataContext = ({ children, personalSettings }) => {
  const [essentialData, setEssentialData] = useState({
    isProcessing: false,
    pathName: "",
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
    dragAreaMsg: "點擊此處選擇檔案或直接拖曳檔案至此",
    claimPayload: [],
    preserveValues: [],
    personalSettings: {
      isDarkMode: false,
      fontSize: 2,
      openTooltip: true,
      showClaimElementKey: true,
      synchronizeHighlight: false,
      readingModePureText: false,
      useDatabase: false,
      savedApplications: {},
      ...personalSettings
    },
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
    allErrors_v2: {
      system_fail: [],
      no_law: [],
      law_104: [],
      law_112_3: [],
      law_112_5: [],
      structuredResult: {},
    },
    readMeOptions: {
      showUsage: false,
      showDetectableErrors: false
    },
    globalHighlightOn: true,
    globalHighlightElement: [],
    dbResultMap: {},
    resultDispType: "new", // "new" | "old"
  });

  return (
    <EssentialDataContextProvider.Provider
      value={[essentialData, setEssentialData]}
    >
      {children}
    </EssentialDataContextProvider.Provider>
  );
};

export default EssentialDataContext;

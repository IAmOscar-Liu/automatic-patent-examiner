// (申請專利範圍請求項|申請專利範圍|權利要求|請求項)

import { claimStartTerms } from "./claimStartTerms";

export const claimStartReg = RegExp(
  `^(${claimStartTerms})第?\\(?[0-9]+\\)?項?(\\s*(以及|[-~～,，、到至或與和及跟])\\s*(${claimStartTerms})?第?\\(?[0-9]+\\)?項?)*`
);

export const getAllClaims = (reg) =>
  reg
    .split(/以及|[,，、或與和及跟]/)
    .map((e) => e.replaceAll(RegExp(`${claimStartTerms}|\\(|\\)|\\s`, "g"), ""))
    .map((e) => e.replaceAll(/第|項/g, ""));

export const shouldClaimUseAny = (claimMatchString, claimRanges) => {
  console.log("claimMatchString", claimMatchString);
  console.log(claimRanges);
  debugger;

  if (/[-~～,，、到至與和及跟]/.test(claimMatchString)) return true;

  if (claimRanges.length > 1 && !/或/.test(claimMatchString)) return true;

  return false;
};

export const claimHasOrNoAnd = (claimMatchString, claimRanges) => {
  if (claimRanges.length === 1 && Number(claimRanges[0])) return true;

  if (/以及|[與和及跟]/.test(claimMatchString)) return false;

  if (/或/.test(claimMatchString)) return true;

  return false;
};

/*
  申請專利範圍第1、2或3項所述
  申請專利範圍第1或2或3項所述
  申請專利範圍第1項、第2項、或第3項其中任一項所述
  申請專利範圍第1項或第2項或第3項所述
  申請專利範圍第1、2、3項其中任一項所述

  申請專利範圍第4至6、10項其中任一項所述
  申請專利範圍第3、4、6至10項其中任一項所述
  申請專利範圍第3至4、6至10項其中任一項所述
  申請專利範圍第3至4、6、8至10項其中任一項所述
  申請專利範圍第1至3項其中任一項所述

  申請專利範圍第1項及申請專利範圍第3項其中任一項所述
  申請專利範圍第1項或申請專利範圍第3項所述
*/

/*
         申請專利範圍第1、2或3項    ->  [1,2]  
         申請專利範圍第1或2或3項   -> [1,2,3]
         申請專利範圍第1項、第2項、或第3項 -> [1,2,3] yes
         申請專利範圍第1項或第2項或第3項 -> [1,2,3]
         申請專利範圍第1、2、3項 -> [1,2,3]  yes

         申請專利範圍第4至6、10項 -> [4至6,10] yes
         申請專利範圍第3、4、6至10項 -> [3,4,6至10] yes
         申請專利範圍第3至4、6至10項 -> [3至4,6至10] yes
         申請專利範圍第3至4、6、8至10項 -> [3至4,6,8至10] yes
         申請專利範圍第1至3項 -> [1至3] yes

         申請專利範圍第1項及申請專利範圍第3項 -> [1,3] yes
         申請專利範圍第1項或申請專利範圍第3項 -> [1,3]
    */

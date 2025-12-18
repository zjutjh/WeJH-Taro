/**
 * 判断是否为屏峰校区（包括翰墨香林、金月巷）
 * 根据浙工大官方网站 翰墨香林 金月巷 也认为是 "屏峰"
 * @param campusName 校区名称
 */
export const isPFCampus = (campusName: string): boolean => {
  return campusName === "屏峰" || campusName === "翰墨香林" || campusName === "金月巷";
};

const products = {
  HDB_RENOSMART: require("./src/config/products").HDB_RENOSMART_PRODUCT,
  WEDDING_ANGBAO: require("./src/config/products").WEDDING_ANGBAO_PRODUCT,
  PR_READINESS: require("./src/config/products").PR_READINESS_PRODUCT,
  P1_PHASE_MAPPER: require("./src/config/products").P1_PHASE_MAPPER_PRODUCT,
  MDW_TCO: require("./src/config/products").MDW_TCO_PRODUCT,
};
for (const [name, p] of Object.entries(products)) {
  console.log(name + ":");
  console.log("  key: " + p.key);
  console.log("  masterAssetFile: " + p.masterAssetFile);
  console.log("  downloadFileName: " + p.downloadFileName);
  console.log("  paypalUrl: " + p.paypalUrl);
  console.log("");
}
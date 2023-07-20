import { useContext } from "react";

// get the ExtensionContext and find pageInfo.basePath if it's valid
export default function useBasePath() {
  // eslint-disable-next-line no-undef
  const pageInfo = useContext(contexts.ExtensionContext)?.pageInfo?.basePath;

  if (pageInfo) {
    const alias = pageInfo.split("/")[1];
    let modifiedBasePath = pageInfo.replace(`/${alias}`, "");

    const lastChar = modifiedBasePath.substr(-1);
    if (lastChar === "/") {
      modifiedBasePath = modifiedBasePath.substring(
        0,
        modifiedBasePath.length - 1
      );
    }

    return modifiedBasePath;
  }
  return "";
}

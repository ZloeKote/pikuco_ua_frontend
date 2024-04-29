import { createContext, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { optionsType } from "../predefined/OptionsType";

const ParamsContext = createContext();

function Provider({ children }) {
  const [searchParams] = useSearchParams();
  const [quizzesSearchParams, setQuizzesSearchParams] = useState(
    searchParams.toString() !== "" ? "?" + searchParams.toString() : ""
  );
 
  const typeParamOption = optionsType.find((opt) => opt.value === searchParams.get("type"));
  const [quizzesTypeSelection, setQuizzesTypeSelection] = useState(
    typeParamOption !== undefined ? typeParamOption : optionsType[0]
  );

  const changeQuizzesSearchParams = (params) => {
    setQuizzesSearchParams(params);
  };

  const changeQuizzesTypeSelection = (typeOption) => {
    setQuizzesTypeSelection(typeOption);
  }

  const searchParamsToShare = {
    quizzesSearchParams,
    changeQuizzesSearchParams,
    quizzesTypeSelection,
    changeQuizzesTypeSelection
  };

  return <ParamsContext.Provider value={searchParamsToShare}>{children}</ParamsContext.Provider>;
}

export { Provider };
export default ParamsContext;

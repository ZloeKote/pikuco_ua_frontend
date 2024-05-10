import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { iso6393 } from "iso-639-3";
import predefinedLanguages from "../../predefined/AvailableLanguages";


const getLanguages = (currLanguage, currLangName) => {
  if (currLangName?.length < 2) return predefinedLanguages;
  const searchedLanguage = predefinedLanguages.filter(
    (lang) => lang.name.toLowerCase().includes(currLangName?.toLowerCase()) && lang.type === "living"
  );
  return currLangName === "" || currLangName === currLanguage?.name ? predefinedLanguages : searchedLanguage;
};

function LanguageAutocompleter({ value, onChange, variant = "outlined", defaultValue = "uk", required, ...rest }) {
  const [language, setLanguage] = useState(
    iso6393.find((lang) => lang.iso6391 === defaultValue)
  );
  const [inputLang, setInputLang] = useState(value ? value.name : language.name);
  const languages = getLanguages(value ? value : language, inputLang);

  return (
    <Autocomplete
      disablePortal
      value={value ? value : language}
      options={languages}
      filterOptions={(x) => x}
      getOptionLabel={(lang) => lang.name}
      onChange={(_, newLang) => onChange ? onChange(newLang) : setLanguage(newLang)}
      inputValue={inputLang}
      onInputChange={(_, newInputLang) => setInputLang(newInputLang)}
      isOptionEqualToValue={(option, lang) => option.iso6391 === lang.iso6391}
      disableClearable
      renderInput={(params) => <TextField {...params} label="Мова" variant={variant} required={required}/>}
      {...rest}
    />
  );
}

export default LanguageAutocompleter;

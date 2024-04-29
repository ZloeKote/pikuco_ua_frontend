import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { iso6393 } from "iso-639-3";

const defaultLanguages = iso6393.filter(
  (lang) => lang.iso6391 === "uk" || lang.iso6391 === "en" || lang.iso6391 === "es" || lang.iso6391 === "de"
);

const getLanguages = (currLanguage, currLangName) => {
  if (currLangName.length < 3) return defaultLanguages;
  const searchedLanguage = iso6393.filter(
    (lang) => lang.name.toLowerCase().includes(currLangName.toLowerCase()) && lang.type === "living"
  );
  return currLangName === "" || currLangName === currLanguage.name ? defaultLanguages : searchedLanguage;
};

function LanguageAutocompleter() {
  const [language, setLanguage] = useState(iso6393.find((lang) => lang.iso6391 === "uk"));
  const [inputLang, setInputLang] = useState(language.name);
  const languages = getLanguages(language, inputLang);

  return (
    <Autocomplete
      disablePortal
      value={language}
      options={languages}
      filterOptions={(x) => x}
      getOptionLabel={(lang) => lang.name}
      onChange={(_, newLang) => setLanguage(newLang)}
      inputValue={inputLang}
      onInputChange={(_, newInputLang) => setInputLang(newInputLang)}
      isOptionEqualToValue={(option, lang) => option.iso6391 === lang.iso6391}
      sx={{ width: 250 }}
      disableClearable
      renderInput={(params) => <TextField {...params} label="Мова" variant="standard" />}
    />
  );
}

export default LanguageAutocompleter;

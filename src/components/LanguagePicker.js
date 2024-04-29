import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { iso6393 } from "iso-639-3";

const defaultLanguages = iso6393.filter(
  (lang) => lang.iso6391 === "uk" || lang.iso6391 === "en" || lang.iso6391 === "es" || lang.iso6391 === "de" || lang.iso6391 === "it"
);

export default function LanguagePicker({ currLanguageCode, languageCodes, handleChangeLanguage}) {
  const renderedLanguages = languageCodes.map((langCode) => {
    const langName = iso6393.find((lang) => lang.iso6391 === langCode).name;
    return <MenuItem value={langCode} key={langCode}>{langName}</MenuItem>
  });
  const handleChange = (e) => handleChangeLanguage(e.target.value);

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth>
        <InputLabel>Мова</InputLabel>
        <Select value={currLanguageCode} label="Мова" onChange={handleChange} MenuProps={{ style: { maxHeight: 260 } }}>
          {renderedLanguages}
        </Select>
      </FormControl>
    </Box>
  );
}

import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material";
import { iso6393 } from "iso-639-3";

export default function LanguagePicker({ currLanguageCode, languageCodes, handleChangeLanguage, label = "Мова", size = "small", ...rest }) {
  const renderedLanguages = languageCodes.map((langCode) => {
    const langName = iso6393.find((lang) => lang.iso6391 === langCode).name;
    return (
      <MenuItem value={langCode} key={langCode}>
        {langName}
      </MenuItem>
    );
  });
  const handleChange = (e) => handleChangeLanguage(e.target.value);

  return (
    <Box sx={{ minWidth: 150 }} >
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          value={currLanguageCode}
          label={label}
          onChange={handleChange}
          MenuProps={{ style: { maxHeight: 260 } }}
          size={size}
          {...rest}
        >
          {renderedLanguages}
        </Select>
      </FormControl>
    </Box>
  );
}

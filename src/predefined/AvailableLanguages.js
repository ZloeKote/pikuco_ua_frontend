import { iso6393 } from "iso-639-3";

const languages = iso6393.filter(
  (lang) =>
    lang.iso6391 === "uk" ||
    lang.iso6391 === "en" ||
    lang.iso6391 === "es" ||
    lang.iso6391 === "de" ||
    lang.iso6391 === "ab" ||
    lang.iso6391 === "ar" ||
    lang.iso6391 === "av" ||
    lang.iso6391 === "az" ||
    lang.iso6391 === "be" ||
    lang.iso6391 === "bg" ||
    lang.iso6391 === "bh" ||
    lang.iso6391 === "bn" ||
    lang.iso6391 === "bs" ||
    lang.iso6391 === "ca" ||
    lang.iso6391 === "cs" ||
    lang.iso6391 === "cy" ||
    lang.iso6391 === "da" ||
    lang.iso6391 === "dv" ||
    lang.iso6391 === "el" ||
    lang.iso6391 === "et" ||
    lang.iso6391 === "fi" ||
    lang.iso6391 === "fr" ||
    lang.iso6391 === "ga" ||
    lang.iso6391 === "he" ||
    lang.iso6391 === "hi" ||
    lang.iso6391 === "hr" ||
    lang.iso6391 === "hu" ||
    lang.iso6391 === "hy" ||
    lang.iso6391 === "in" ||
    lang.iso6391 === "is" ||
    lang.iso6391 === "it" ||
    lang.iso6391 === "ja" ||
    lang.iso6391 === "ka" ||
    lang.iso6391 === "kg" ||
    lang.iso6391 === "kk" ||
    lang.iso6391 === "kn" ||
    lang.iso6391 === "ko" ||
    lang.iso6391 === "ks" ||
    lang.iso6391 === "ky" ||
    lang.iso6391 === "la" ||
    lang.iso6391 === "lb" ||
    lang.iso6391 === "lt" ||
    lang.iso6391 === "lv" ||
    lang.iso6391 === "mi" ||
    lang.iso6391 === "ml" ||
    lang.iso6391 === "mn" ||
    lang.iso6391 === "mo" ||
    lang.iso6391 === "ne" ||
    lang.iso6391 === "nl" ||
    lang.iso6391 === "no" ||
    lang.iso6391 === "os" ||
    lang.iso6391 === "pl" ||
    lang.iso6391 === "pt" ||
    lang.iso6391 === "ro" ||
    lang.iso6391 === "ru" ||
    lang.iso6391 === "sk" ||
    lang.iso6391 === "sl" ||
    lang.iso6391 === "so" ||
    lang.iso6391 === "sq" ||
    lang.iso6391 === "sr" ||
    lang.iso6391 === "sv" ||
    lang.iso6391 === "tg" ||
    lang.iso6391 === "th" ||
    lang.iso6391 === "tk" ||
    lang.iso6391 === "tr" ||
    lang.iso6391 === "tt" ||
    lang.iso6391 === "ug" ||
    lang.iso6391 === "uz" ||
    lang.iso6391 === "za" ||
    lang.iso6391 === "zh"
);

export default languages;
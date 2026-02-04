"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translateText = translateText;
const axios_1 = __importDefault(require("axios"));
const endpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
const key = process.env.AZURE_TRANSLATOR_KEY;
const region = process.env.AZURE_TRANSLATOR_REGION;
async function translateText(text, targets) {
    const translations = {
        en: "",
        hi: "",
        mr: "",
    };
    if (!text || !text.trim())
        return translations;
    const targetArray = Array.isArray(targets) ? targets : [targets];
    const response = await axios_1.default.post(`${endpoint}/translate`, [{ text }], {
        params: {
            "api-version": "3.0",
            to: targetArray.join(","),
        },
        headers: {
            "Ocp-Apim-Subscription-Key": key,
            "Ocp-Apim-Subscription-Region": region,
            "Content-Type": "application/json",
        },
    });
    const detectedLang = response.data[0].detectedLanguage?.language;
    response.data[0].translations.forEach((t) => {
        translations[t.to] = t.text;
    });
    if (detectedLang && translations[detectedLang] === "") {
        translations[detectedLang] = text;
    }
    return translations;
}

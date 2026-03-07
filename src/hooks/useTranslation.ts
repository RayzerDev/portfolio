import {useLanguage} from "@/context/LanguageContext";
import fr from "@/data/locales/fr/common.json";
import en from "@/data/locales/en/common.json";

const translations = {fr, en};

export function useTranslation() {
    const {lang} = useLanguage();
    const dict = translations[lang];

    function t(path: string): string {
        const keys = path.split(".");
        let value: any = dict;
        for (const key of keys) {
            value = value?.[key];
        }
        return typeof value === "string" ? value : path;
    }

    return {t, lang};
}

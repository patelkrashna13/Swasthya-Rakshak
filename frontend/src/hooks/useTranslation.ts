import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            console.warn(`Translation key "${key}" not found`);
            return key; // Return the key itself if translation not found
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const formatMessage = (key: string, params: Record<string, string | number> = {}): string => {
    let message = t(key);
    
    // Replace placeholders like {min}, {max} with actual values
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(new RegExp(`\\{${param}\\}`, 'g'), String(value));
    });

    return message;
  };

  return { t, formatMessage, language };
};

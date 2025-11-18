export interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export interface LanguageProviderProps {
  children: React.ReactNode;
}

"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    };
  }
}

export function LanguageDetector() {
  useEffect(() => {
    const browserLang = navigator.language?.split("-")[0] ?? "en";
    if (browserLang === "en") return;

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        { pageLanguage: "en", autoDisplay: true },
        "google_translate_element"
      );
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div id="google_translate_element" className="hidden" />;
}

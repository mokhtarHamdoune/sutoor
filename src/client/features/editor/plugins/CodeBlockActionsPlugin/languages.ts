/**
 * Supported programming languages for code block syntax highlighting.
 *
 * This configuration defines the languages available in the code block language selector.
 * Each language must be supported by Prism.js (used by @lexical/code for syntax highlighting).
 *
 * @see https://prismjs.com/#supported-languages
 */

export interface ProgrammingLanguage {
  /** Internal value used by Prism.js */
  value: string;
  /** Display label shown to users */
  label: string;
}

/**
 * List of supported programming languages for code blocks.
 * Ordered by popularity and common usage.
 */
export const SUPPORTED_LANGUAGES: readonly ProgrammingLanguage[] = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "php", label: "PHP" },
  { value: "ruby", label: "Ruby" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "bash", label: "Bash" },
  { value: "shell", label: "Shell" },
] as const;

/**
 * Default language for new code blocks
 */
export const DEFAULT_CODE_LANGUAGE = "javascript";

/**
 * Type guard to check if a string is a valid language value
 */
export function isValidLanguage(lang: string): boolean {
  return SUPPORTED_LANGUAGES.some((l) => l.value === lang);
}

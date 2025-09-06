import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const useEditor = () => {
  const [editor] = useLexicalComposerContext();
  return { editor };
};

export default useEditor;

import { createContext, FC, useCallback, useContext} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { solarizedDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { clipboard } from 'electron';



const CodeContext = createContext({ value: '' });


const CopyBtn: FC<{ text: string }> = ({ text }) => {
  const copy = useCallback(() => {
    clipboard.writeText(text);
  }, [text])

  return <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pr-2" onClick={copy}>Copy</div>;
}

const PreTag: FC<{ style: any }> = ({ children, style }) => {
  const { value } = useContext(CodeContext);

  return <div style={style} className="group relative">
    <CopyBtn text={value} />
    {children}
  </div>
}

export const Code: FC<{ language: string, value: string }> = ({ language, value }) => {

  return (
    <CodeContext.Provider value={{ value }}>
      <SyntaxHighlighter language={language} style={solarizedDark} PreTag={PreTag}>
        {value}
      </SyntaxHighlighter>
    </CodeContext.Provider>
  );
}
import {ElementType, FC} from 'react';
import ReactMarkdown from 'react-markdown';
import {Code} from './Markdown/Code';
import {Link} from './Markdown/Link';
import {Heading} from './Markdown/Heading';
import {Paragraph} from './Markdown/Paragraph';
import {useFileContents} from "./Wrapper";

type NodeType = "root" | // — Whole document
    "text" | // — Text (foo)
    "break" | // — Hard break (<br>)
    "paragraph" | // — Paragraph (<p>)
    "emphasis" | // — Emphasis (<em>)
    "strong" | // — Strong (<strong>)
    "thematicBreak" | // — Horizontal rule (<hr>)
    "blockquote" | // — Block quote (<blockquote>)
    "link" | // — Link (<a>)
    "image" | // — Image (<img>)
    "linkReference" | // — Link through a reference (<a>)
    "imageReference" | // — Image through a reference (<img>)
    "list" | // — List (<ul> or <ol>)
    "listItem" | // — List item (<li>)
    "definition" | // — Definition for a reference (not rendered)
    "heading" | // — Heading (<h1> through <h6>)
    "inlineCode" | // — Inline code (<code>)
    "code" | // — Block of code (<pre><code>)
    "html" | // — HTML node (Best-effort rendering)
    "virtualHtml" | // — If allowDangerousHtml is not on and skipHtml is off, a naive HTML parser is used to support basic HTML
    "parsedHtml"  // — If allowDangerousHtml is on, skipHtml is off, and html-parser is used, more advanced HTML is supported

const renderers: Partial<{ [nodeType in NodeType]: ElementType }> = {
    link: Link,
    code: Code,
    heading: Heading,
    paragraph: Paragraph
};

// const renderer: Partial<Renderer> = {
//   heading: (text, level) => `<h${level}>${text}</h${level}>`,
//   link: (href, title, text) => `<a href="#" onclick="window.openExternal('${href}')" title="${title}">${text}<a/>`
// };

export const Preview: FC<{ filepath: string }> = ({filepath}) => {
    const fileData = useFileContents(filepath);
    return <ReactMarkdown renderers={renderers}>{fileData}</ReactMarkdown>
}


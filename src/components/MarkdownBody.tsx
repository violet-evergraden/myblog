"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function MarkdownBody({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // 按需加载 highlight.js 语言并高亮
    Promise.all([
      import("highlight.js/lib/core"),
      import("highlight.js/lib/languages/xml"),
      import("highlight.js/lib/languages/css"),
      import("highlight.js/lib/languages/javascript"),
      import("highlight.js/lib/languages/typescript"),
      import("highlight.js/lib/languages/rust"),
      import("highlight.js/lib/languages/markdown"),
      import("highlight.js/lib/languages/bash"),
      import("highlight.js/lib/languages/json"),
      import("highlight.js/lib/languages/python"),
    ]).then(([hljs, xml, css, js, ts, rust, md, bash, json, py]) => {
      hljs.default.registerLanguage("xml", xml.default);
      hljs.default.registerLanguage("css", css.default);
      hljs.default.registerLanguage("javascript", js.default);
      hljs.default.registerLanguage("typescript", ts.default);
      hljs.default.registerLanguage("rust", rust.default);
      hljs.default.registerLanguage("markdown", md.default);
      hljs.default.registerLanguage("bash", bash.default);
      hljs.default.registerLanguage("json", json.default);
      hljs.default.registerLanguage("python", py.default);

      ref.current!.querySelectorAll("pre code").forEach((el) => {
        hljs.default.highlightElement(el as HTMLElement);
      });
    });
  }, [content]);

  return (
    <div
      ref={ref}
      className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20"
    >
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </div>
  );
}

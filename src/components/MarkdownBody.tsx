"use client";

import { useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function MarkdownBody({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const addCopyButtons = useCallback(() => {
    if (!ref.current) return;
    ref.current.querySelectorAll("pre").forEach((pre) => {
      // 避免重复添加
      if (pre.parentElement?.classList.contains("relative")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "relative group";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement("button");
      btn.className =
        "absolute top-2 right-2 px-2 py-1 rounded-md text-[11px] font-medium " +
        "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80 " +
        "opacity-0 group-hover:opacity-100 transition-all duration-200 " +
        "backdrop-blur-sm border border-white/10 cursor-pointer";
      btn.textContent = "复制";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code");
        const text = code?.textContent || pre.textContent || "";
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = "已复制 ✓";
          btn.classList.add("!text-green-400", "!bg-green-500/10");
          setTimeout(() => {
            btn.textContent = "复制";
            btn.classList.remove("!text-green-400", "!bg-green-500/10");
          }, 2000);
        });
      });
      wrapper.appendChild(btn);
    });
  }, []);

  useEffect(() => {
    if (!ref.current) return;
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

      addCopyButtons();
    });
  }, [content, addCopyButtons]);

  return (
    <div
      ref={ref}
      className="prose prose-zinc dark:prose-invert max-w-none prose-headings:scroll-mt-20"
    >
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content}</ReactMarkdown>
    </div>
  );
}

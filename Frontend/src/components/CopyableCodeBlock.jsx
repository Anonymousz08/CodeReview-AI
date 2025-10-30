import { useState, useMemo } from "react";

export default function CopyableCodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const cleanCode = useMemo(() => {
    return code
      .replace(/```[a-zA-Z]*\n?/, "") // remove ```lang (like ```java)
      .replace(/```$/, "") // remove ending ```
      .trim();
  }, [code]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(cleanCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#1e1e1e] text-white p-3 rounded-lg mt-3 mb-3">
      <pre className="overflow-x-auto text-sm">
        <code>{cleanCode}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="copyButton absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 rounded status-indicator idle"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

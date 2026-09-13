import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Check, Download, Link2, Share2 } from "lucide-react";

export default function ShareMenu({ targetRef, getShareUrl, fileName = "tournament-results" }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied or unavailable — nothing more we can do here.
    }
  }

  async function handleDownloadImage() {
    if (!targetRef.current) return;
    const dataUrl = await toPng(targetRef.current, {
      backgroundColor: "#0a0a0a",
      pixelRatio: 2,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${fileName}.png`;
    link.click();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
      >
        <Share2 size={16} />
        Share
      </button>

      {open && (
        <div className="absolute z-10 top-full mt-2 right-0 md:left-0 md:right-auto w-52 bg-neutral-900 border border-neutral-500/30 rounded-xl shadow-lg overflow-hidden">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            {copied ? (
              <Check size={16} className="text-blue-400" />
            ) : (
              <Link2 size={16} />
            )}
            {copied ? "Copied!" : "Copy shareable link"}
          </button>
          <button
            type="button"
            onClick={handleDownloadImage}
            className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            <Download size={16} />
            Download as image
          </button>
        </div>
      )}
    </div>
  );
}

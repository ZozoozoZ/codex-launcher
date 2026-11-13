export function desktopAddress(fragment) {
  const match = /^#thread=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(fragment);
  return match ? `codex://threads/${match[1].toLowerCase()}` : null;
}

export function androidAddress(fragment) {
  const desktop = desktopAddress(fragment);
  if (desktop === null) return null;
  const id = desktop.slice("codex://threads/".length);
  const fallback = encodeURIComponent(`https://codex.boissy.us/?android_fallback=1#thread=${id}`);
  return `intent://codex/open#Intent;scheme=com.openai.chat;package=com.openai.chatgpt;S.browser_fallback_url=${fallback};end`;
}

if (typeof document !== "undefined") {
  const status = document.getElementById("status");
  const open = document.getElementById("open-chat");
  const isAndroid = /\bAndroid\b/i.test(navigator.userAgent);
  const address = desktopAddress(window.location.hash);
  if (address === null) {
    status.textContent = "This link has no valid chat ID. Open the complete link from your SORB email, or find the task in Codex.";
  } else {
    status.textContent = isAndroid
      ? "Open Codex, then select the task named in your SORB email."
      : "Your task is ready to open on the computer where it runs.";
    open.href = isAndroid ? androidAddress(window.location.hash) : address;
    open.textContent = isAndroid ? "Open Codex on Android ↗" : "Open this chat on PC ↗";
    open.hidden = false;
    document.getElementById("launch-note").textContent = isAndroid
      ? "This opens Codex in ChatGPT. The conversation is not selected automatically."
      : "Your browser may ask permission to open the desktop app.";
    document.getElementById("launch-note").hidden = false;
    document.getElementById("fallback").hidden = isAndroid;
    document.getElementById("phone-help").hidden = !isAndroid;
    if (isAndroid && new URLSearchParams(window.location.search).get("android_fallback") === "1") {
      status.textContent = "Your browser did not open ChatGPT. Open ChatGPT manually and choose Codex or Remote.";
    }
    if (!isAndroid && !/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      status.textContent = "Opening your chat in Codex. If it does not open, use the button below.";
      try {
        window.location.replace(address);
      } catch {
        status.textContent = "Your browser could not open Codex automatically. Use the button below.";
      }
    }
    document.getElementById("address").textContent = address;
    document.getElementById("copy-address").addEventListener("click", async () => {
      const feedback = document.getElementById("copy-status");
      try {
        await navigator.clipboard.writeText(address);
        feedback.textContent = "Address copied.";
      } catch {
        feedback.textContent = "Copy was unavailable. Select and copy the address above.";
      }
    });
  }
}

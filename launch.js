export function desktopAddress(fragment) {
  const match = /^#thread=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(fragment);
  return match ? `codex://threads/${match[1].toLowerCase()}` : null;
}

if (typeof document !== "undefined") {
  const status = document.getElementById("status");
  const open = document.getElementById("open-chat");
  const address = desktopAddress(window.location.hash);
  if (address === null) {
    status.textContent = "This link has no valid chat ID. Open the complete link from your SORB email, or find the task in Codex.";
  } else {
    status.textContent = "Your task is ready to open on the computer where it runs.";
    open.href = address;
    open.hidden = false;
    document.getElementById("launch-note").hidden = false;
    document.getElementById("fallback").hidden = false;
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

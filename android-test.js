export function androidIntent(fragment) {
  const match = /^#thread=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(fragment);
  if (!match) return null;
  const id = match[1].toLowerCase();
  const fallback = encodeURIComponent(`https://codex.boissy.us/android-test.html?fallback=1#thread=${id}`);
  return `intent://threads/${id}#Intent;scheme=codex;package=com.openai.chatgpt;S.browser_fallback_url=${fallback};end`;
}

if (typeof document !== "undefined") {
  const status = document.getElementById("status");
  const open = document.getElementById("android-open");
  const intent = androidIntent(window.location.hash);
  if (intent === null) {
    status.textContent = "Identifiant de conversation absent ou invalide. Utilise le lien complet fourni dans la conversation.";
  } else {
    open.href = intent;
    open.hidden = false;
    status.textContent = new URLSearchParams(window.location.search).get("fallback") === "1"
      ? "Chrome n’a pas ouvert ChatGPT avec ce lien. L’application peut ne pas reconnaître ce lien, ou le navigateur peut avoir refusé son ouverture. Signale ce message dans la conversation."
      : "Lien prêt. Touche le bouton pour lancer le test.";
  }
}

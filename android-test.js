export function androidIntent(fragment) {
  const match = /^#thread=([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.exec(fragment);
  if (!match) return null;
  const id = match[1].toLowerCase();
  const fallback = encodeURIComponent(`https://codex.boissy.us/android-test.html?fallback=1#thread=${id}`);
  return `intent://threads/${id}#Intent;scheme=codex;package=com.openai.chatgpt;S.browser_fallback_url=${fallback};end`;
}

export function androidEntryIntent() {
  const fallback = encodeURIComponent("https://codex.boissy.us/android-test.html?fallback=entry&v=2");
  return `intent://codex/open#Intent;scheme=com.openai.chat;package=com.openai.chatgpt;S.browser_fallback_url=${fallback};end`;
}

if (typeof document !== "undefined") {
  const status = document.getElementById("status");
  const open = document.getElementById("android-open");
  const entry = document.getElementById("android-entry");
  const clicks = document.getElementById("click-status");
  entry.href = androidEntryIntent();
  entry.hidden = false;
  entry.addEventListener("click", () => {
    clicks.textContent = "Clic reçu : test 1. La page a demandé l’ouverture de l’écran Codex. Cela ne confirme pas que ChatGPT s’est ouvert.";
  });
  open.addEventListener("click", () => {
    clicks.textContent = "Clic reçu : test 2. La page a demandé l’ouverture de la conversation. Cela ne confirme pas que ChatGPT s’est ouvert.";
  });
  const intent = androidIntent(window.location.hash);
  const fallback = new URLSearchParams(window.location.search).get("fallback");
  if (intent === null) {
    status.textContent = "Le test 1 est prêt. Pour le test 2, utilise le lien complet fourni dans la conversation.";
  } else {
    open.href = intent;
    open.hidden = false;
    status.textContent = "Les tests sont prêts. Commence par le bouton 1.";
  }
  if (fallback === "1" || fallback === "entry") {
    status.textContent = `Chrome n’a pas ouvert ChatGPT pour le test ${fallback === "entry" ? "1" : "2"}. L’application peut ne pas reconnaître ce lien, ou le navigateur peut avoir refusé son ouverture.`;
  }
}

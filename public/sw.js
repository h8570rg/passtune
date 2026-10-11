// Passtune の Service Worker。
// Android の Chrome で「アプリとしてインストール」できるようにするため、fetch ハンドラーを持つ（docs/research/2026-09-28-multiplatform-approach.md）。
// 画面はネットワークから取得し、オフラインのときだけ簡単な案内を返す。データのキャッシュはしない。

const OFFLINE_HTML = `<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>オフライン | Passtune</title>
<body style="font-family:system-ui;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center;padding:16px">
<div><h1 style="font-size:20px">オフラインです</h1><p>インターネットに接続してから、もう一度開いてください。</p></div></body></html>`;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(
      () => new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } }),
    ),
  );
});

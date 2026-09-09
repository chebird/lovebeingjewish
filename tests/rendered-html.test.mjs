import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://www.lovebeingjewish.com/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Love Being Jewish homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Love Being Jewish<\/title>/i);
  assert.match(html, /<span>LOVE\.<\/span>/);
  assert.match(html, /<span>BEING\.<\/span>/);
  assert.match(html, /<span>JEWISH\.<\/span>/);
  assert.doesNotMatch(
    html,
    /codex-preview|Building your site|SkeletonPreview|Join the list|newsletter|Mailchimp|ConvertKit|Google Forms|mailto:|Contact|Gather|Learn|Celebrate/,
  );
});

test("uses site-specific metadata and assets", async () => {
  const [layout, page, packageJson] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /https:\/\/www\.lovebeingjewish\.com/);
  assert.match(layout, /LOVE\. BEING\. JEWISH\./);
  assert.doesNotMatch(layout, /\/og\.png|summary_large_image|everyday joy/);
  assert.match(page, /<span>LOVE\.<\/span>/);
  assert.match(page, /<span>BEING\.<\/span>/);
  assert.match(page, /<span>JEWISH\.<\/span>/);
  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

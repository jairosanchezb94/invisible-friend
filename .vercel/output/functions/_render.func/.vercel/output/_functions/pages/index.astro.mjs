/* empty css                                 */
import { c as createComponent, a as createAstro, r as renderComponent, b as renderTemplate, d as addAttribute, e as renderHead, f as renderSlot, m as maybeRenderHead } from '../chunks/astro/server_DQsSmjab.mjs';
import 'kleur/colors';
export { renderers } from '../renderers.mjs';

const $$Astro$1 = createAstro();
const $$Index$1 = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index$1;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} `;
}, "/vercel/sandbox/primary/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="description" content="Invisible Friend App"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderComponent($$result, "Analytics", $$Index$1, {})}${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/vercel/sandbox/primary/src/layouts/Layout.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Invisible Friend" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main> ${renderComponent($$result2, "InvisibleFriend", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/vercel/sandbox/primary/src/components/InvisibleFriend.jsx", "client:component-export": "default" })} </main> ` })}`;
}, "/vercel/sandbox/primary/src/pages/index.astro", void 0);

const $$file = "/vercel/sandbox/primary/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

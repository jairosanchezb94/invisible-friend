import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_BDjVMvyp.mjs';
import { manifest } from './manifest_rQ41kpZ_.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/send-results.astro.mjs');
const _page2 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/send-results.js", _page1],
    ["src/pages/index.astro", _page2]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "fd823980-682d-4601-82b9-b50f2ab6f55f",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };

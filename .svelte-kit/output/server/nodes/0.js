import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.DVBNw5kx.js","_app/immutable/chunks/Dc1BERz9.js","_app/immutable/chunks/CFoqiGzc.js","_app/immutable/chunks/DVKMQDi8.js","_app/immutable/chunks/DVNiFOi7.js","_app/immutable/chunks/BUT90LOb.js","_app/immutable/chunks/ByEG_e9Y.js"];
export const stylesheets = ["_app/immutable/assets/0.Bemves4v.css"];
export const fonts = [];

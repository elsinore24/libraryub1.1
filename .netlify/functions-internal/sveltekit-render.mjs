import { init } from '../serverless.js';

export const handler = init((() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "library/_app",
	assets: new Set(["_redirects","default-clue.png","favicon.png","images/clues/poisoned-page.png","sounds/.gitkeep","sounds/library-ambience.mp3"]),
	mimeTypes: {".png":"image/png",".mp3":"audio/mpeg"},
	_: {
		client: {start:"_app/immutable/entry/start.DVwTJkaY.js",app:"_app/immutable/entry/app.16ZXF0At.js",imports:["_app/immutable/entry/start.DVwTJkaY.js","_app/immutable/chunks/TtvPwlMe.js","_app/immutable/chunks/Dc1BERz9.js","_app/immutable/chunks/BUT90LOb.js","_app/immutable/chunks/D32n8VTX.js","_app/immutable/entry/app.16ZXF0At.js","_app/immutable/chunks/ByEG_e9Y.js","_app/immutable/chunks/Dc1BERz9.js","_app/immutable/chunks/CFoqiGzc.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			
		],
		routes: [
			
		],
		prerendered_routes: new Set(["/library/","/library/rooms/library"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})());

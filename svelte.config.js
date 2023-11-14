import adapter from '@sveltejs/adapter-node';
// Make sure this is present
const config = {
	kit: {
		adapter: adapter(),
	},
};

export default config;

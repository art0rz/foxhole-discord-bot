/* eslint-disable import/first,@typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,global-require */
import debug from 'debug';

/**
 * Module dependencies.
 */
const dotenv = require('dotenv');

dotenv.config({ path: `.env` });

const log = debug('app:main');

(async () => {
	const { default: app } = require('./app');
	await app();
})();

process.on('SIGINT', () => {
	log('Exiting ...');
	process.exit();
});

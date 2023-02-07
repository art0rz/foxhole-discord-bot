import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

const lastEventIdFilename = path.join(__dirname, '../../', 'lasteventid');

async function getLastEventId(domain: string, port: string): Promise<number> {
	if (fs.existsSync(lastEventIdFilename)) {
		const id = parseInt(fs.readFileSync(lastEventIdFilename).toString(), 10);

		if (!Number.isNaN(id)) {
			return id;
		}
	}

	const html = await (await fetch(`https://${domain}/`)).text();
	const matches = new RegExp(`https:\\/\\/${domain}:${port}\\/channel\\/eventlog\\?lastEventId=([0-9]+)`).exec(html);

	if (matches === null || Number.isNaN(parseInt(matches[1], 10))) {
		throw new Error('unable to get lastEventId');
	}

	return parseInt(matches[1], 10);
}

export function saveLastEventId(id: number): void {
	fs.writeFileSync(lastEventIdFilename, id.toString());
}

export default getLastEventId;

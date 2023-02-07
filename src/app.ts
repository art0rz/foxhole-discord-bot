import debug from 'debug';
import EventSource from 'eventsource';
import getLastEventId, { saveLastEventId } from './lib/getLastEventId';
import { WorldEvent } from './lib/api';
import sendDiscordMessage from './lib/sendDiscordMessage';
import getRequiredEnvironmentVariable from './lib/getRequiredEnvironmentVariable';

const log = debug('app:main');

const discordWebhookUrl = getRequiredEnvironmentVariable('DISCORD_WEBHOOK_URL');
const foxholeStatsDomain = getRequiredEnvironmentVariable('FOXHOLESTATS_DOMAIN');
const foxholeStatsPort = getRequiredEnvironmentVariable('FOXHOLESTATS_PORT');

async function app() {
	return new Promise<void>(resolve => {
		(async () => {
			const lastEventId = await getLastEventId(foxholeStatsDomain, foxholeStatsPort);
			saveLastEventId(lastEventId);

			log(`Using lastEventId ${lastEventId}`);

			const es = new EventSource(
				`https://${foxholeStatsDomain}:${foxholeStatsPort}/channel/eventlog?lastEventId=${lastEventId}`,
				{
					rejectUnauthorized: false,
				}
			);

			es.addEventListener('open', function open() {
				log('EventSource opened');
				resolve();
			});

			es.addEventListener('event', function messageCallback(event: MessageEvent<string>) {
				const data = JSON.parse(event.data) as WorldEvent;
				const message = `**${data.mapName}** - **${data.town}** was **${data.action.toLowerCase()}** by **__${
					data.team
				}__** on day ${data.day} @ <t:${data.time}:f> (<t:${data.time}:R>)`;
				log('New EventSource message:', message);
				sendDiscordMessage(discordWebhookUrl, message);
				saveLastEventId(data.id);
			});

			es.addEventListener('error', function error(err) {
				log('EventSource error:', err);
				log('Restarting');
				app();
			});

			es.addEventListener('close', function close() {
				log('EventSource closed. Restarting.');
				app();
			});
		})();
	});
}

export default app;

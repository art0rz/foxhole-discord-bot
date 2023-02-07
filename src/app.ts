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

const teamColors = {
	wardens: 0x629aed,
	colonials: 0x54c53d,
};

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

			es.addEventListener('event', async function messageCallback(event: MessageEvent<string>) {
				const data = JSON.parse(event.data) as WorldEvent;
				const action =
					data.action.toLowerCase() === 'construction' ? 'under construction' : data.action.toLowerCase();
				log('New EventSource message:', JSON.stringify(data));
				try {
					await sendDiscordMessage(discordWebhookUrl, {
						content: null,
						embeds: [
							{
								title: `${action.toUpperCase()}`,
								description: `by **${data.team.toUpperCase()}** @ <t:${data.time}:f> (<t:${
									data.time
								}:R>)`,
								color: teamColors[data.team.toLowerCase()],
								author: {
									name: `${data.mapName} - ${data.town}`,
								},
							},
						],
					});

					saveLastEventId(data.id);
				} catch (e) {
					// no op
				}
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

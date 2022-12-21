export interface WorldEvent {
	id: number;
	regionId: number;
	mapName: string;
	iconType: number;
	town: string;
	team: 'WARDENS' | 'COLONIALS';
	action: 'LOST' | 'WON';
	past: string; // '{"teamId":"WARDENS","iconType":56,"x":0.5854038,"y":0.1543734,"flags":8}';
	current: string; // '{"teamId":"NONE","iconType":56,"x":0.5854038,"y":0.1543734,"flags":0}';
	x: number;
	y: number;
	day: string;
	time: number;
}

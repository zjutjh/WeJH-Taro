export function section2time(section: string | number): string {
	let s = typeof section === 'string' ? parseInt(section) : section;
	switch (s) {
		case 1:
			return '08:00';
		case 2:
			return '08:55';
		case 3:
			return '09:55';
		case 4:
			return '10:50';
		case 5:
			return '11:45';
		case 6:
			return '13:30';
		case 7:
			return '14:25';
		case 8:
			return '15:25';
		case 9:
			return '16:20';
		case 10:
			return '18:30';
		case 11:
			return '19:25';
		case 12:
			return '20:20';
		default:
			return '';
	}
}

export function section2endtime(section: string | number): string {
	let s = typeof section === 'string' ? parseInt(section) : section;
	switch (s) {
		case 1:
			return '08:45';
		case 2:
			return '09:40';
		case 3:
			return '10:40';
		case 4:
			return '11:35';
		case 5:
			return '12:30';
		case 6:
			return '14:15';
		case 7:
			return '15:10';
		case 8:
			return '16:10';
		case 9:
			return '17:05';
		case 10:
			return '19:15';
		case 11:
			return '20:10';
		case 12:
			return '21:05';
		default:
			return '';
	}
}

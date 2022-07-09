export interface AppListItem {
	id: number;
	title: string;
	icon: string;
	route: string;
	appId?: string;
	// comment: 后端无类似参数
	type?: 'mini' | 'route';
	backgroundColor: string;
}

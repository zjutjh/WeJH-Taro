export interface AppListItem {
	id: number;
	title: string;
	icon: string;
	route: string;
	appId?: string;
	type?: "mini" | 'route'
	backgroundColor: string;
}

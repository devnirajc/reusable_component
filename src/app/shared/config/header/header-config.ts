import * as $ from 'jquery';

export interface logo {
	path: string;
	link: string;
	imgClass: string;
	alt: string;
}

export interface leftLinks {
	icon: string;
	link?: string;
	class?: string;
	click: Function;
	dropdown: any;
	title?: string;
}

export interface rightLinks {
	name: string;
	icon: string;
	link?: string;
	dropdown?: any;
}


export const HeaderConfig = {
	logo: { path: './assets/images/logo.png', imgClass: 'hide-on-mobile', alt: 'ScopeRetail Logo', link: '#' },
	leftLinks:
		[
			{ icon: 'fa fa-bars', title: 'Toggle Menu', class: 'd-inline d-md-none sidebarBtn', click: () => { $('#sidebar').toggleClass('active'); }, dropdown: null }
		],
	rightLinks:
		[
			{
				name: 'John Smith', icon: 'fa fa-sign-out', link: '#', dropdown:
					[
						{ name: 'Logout', link: '#', dropdown: null }
					]
			}
		],
	AboutLink:
		[
			{
				name: 'About', icon: 'fa fa-info-circle', link: '#', dropdown:
					[
						{ name: 'About', link: '#', dropdown: null }
					]
			}
		]
};
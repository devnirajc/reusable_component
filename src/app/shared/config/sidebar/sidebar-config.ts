export interface MenuItems {
    link?: string;
    titlei18n?: string;
    expanded?: boolean;
    icon?: string;
    sub?: SubMenuItems[];
    click?: any;
    name: string;
    categoryId?: any;
    capabilityId?: any;
    redirect?: string;
}
export interface SubMenuItems {
    link?: string;
    titlei18n?: string;
    expanded?: boolean;
    icon?: string;
    sub?: any;
    click?: any;
    name: string;
    categoryId?: any;
    capabilityId?: any;
}
export const SideBarConfig: MenuItems[] = [
    { name: 'manageOrders', link: '/manage-order', redirect: 'manage-order', icon: "fa fa-search-plus", sub: null },
    {
        name: 'createOrder', icon: "fa fa-first-order", sub:
            [
                { name: 'singleOrder', link: '/create-order/single-order', sub: null },
                { name: 'bulkOrder', link: '/create-order/bulk-order', sub: null}
            ]
    }
];
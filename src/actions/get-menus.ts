"use server";

import { Menus } from '@/interfaces';

export const getMenus = async (): Promise<Menus> => {
    return {
        menuItems: {
            nodes: [
                {
                    title: null,
                    uri: "/",
                    url: "https://classichorseauction.com/stage/",
                    label: "Home",
                    order: 1,
                    path: "/stage/",
                    parentDatabaseId: 0,
                    databaseId: 116
                },
                {
                    title: null,
                    uri: "/about/",
                    url: "https://classichorseauction.com/stage/about/",
                    label: "About",
                    order: 2,
                    path: "/stage/about/",
                    parentDatabaseId: 0,
                    databaseId: 125
                },
                {
                    title: null,
                    uri: "#",
                    url: "#",
                    label: "Auctions",
                    order: 3,
                    path: "#",
                    parentDatabaseId: 0,
                    databaseId: 3584
                },
                {
                    title: null,
                    uri: "/all-auctions/",
                    url: "https://classichorseauction.com/stage/all-auctions/",
                    label: "All Auctions",
                    order: 4,
                    path: "/stage/all-auctions/",
                    parentDatabaseId: 3584,
                    databaseId: 816
                },
                {
                    title: null,
                    uri: "/current-auctions/",
                    url: "https://classichorseauction.com/stage/current-auctions/",
                    label: "Current Auctions",
                    order: 5,
                    path: "/stage/current-auctions/",
                    parentDatabaseId: 3584,
                    databaseId: 3506
                },
                {
                    title: null,
                    uri: "/closed-auctions/",
                    url: "https://classichorseauction.com/stage/closed-auctions/",
                    label: "Closed Auctions",
                    order: 6,
                    path: "/stage/closed-auctions/",
                    parentDatabaseId: 3584,
                    databaseId: 820
                },
                {
                    title: null,
                    uri: "/contact/",
                    url: "https://classichorseauction.com/stage/contact/",
                    label: "Contact",
                    order: 7,
                    path: "/stage/contact/",
                    parentDatabaseId: 0,
                    databaseId: 143
                },
                {
                    title: null,
                    uri: "/my-account/",
                    url: "https://classichorseauction.com/stage/my-account/",
                    label: "Account",
                    order: 8,
                    path: "/stage/my-account/",
                    parentDatabaseId: 0,
                    databaseId: 204
                },
                {
                    title: null,
                    uri: "/my-account/customer-logout/?_wpnonce=5bc973456c",
                    url: "/my-account/customer-logout/?_wpnonce=5bc973456c",
                    label: "Logout",
                    order: 9,
                    path: "/my-account/customer-logout/?_wpnonce=5bc973456c",
                    parentDatabaseId: 0,
                    databaseId: 233
                },
                {
                    title: null,
                    uri: "/leatherwood-trail-horses/",
                    url: "https://classichorseauction.com/stage/leatherwood-trail-horses/",
                    label: "LEATHERWOOD COLLECTION",
                    order: 10,
                    path: "/stage/leatherwood-trail-horses/",
                    parentDatabaseId: 0,
                    databaseId: 7725
                },
                {
                    title: null,
                    uri: "/product-category/horse-classifieds/",
                    url: "https://classichorseauction.com/stage/product-category/horse-classifieds/",
                    label: "CLASSIFIEDS",
                    order: 11,
                    path: "/stage/product-category/horse-classifieds/",
                    parentDatabaseId: 0,
                    databaseId: 13561
                },
                {
                    title: null,
                    uri: "/blog/",
                    url: "https://classichorseauction.com/stage/blog/",
                    label: "Blog",
                    order: 12,
                    path: "/stage/blog/",
                    parentDatabaseId: 0,
                    databaseId: 5145
                }
            ]
        }
    };
};

export interface Home {
    posts: any;
    auctionProducts: AuctionProducts;
}

export interface AuctionsByCategory {
    products: ProductCategories;
}

export interface Menus {
    menuItems: MenuItems;
}

export interface Metadata {
    metadata: MetadataClass;
}

export interface AuctionProducts {
    nodes: AuctionProductsNode[] | [];
    pageInfo: PageInfo;
    found: number | null;
}

export interface ProductCategories {
    nodes: AuctionProductsNode[] | [];
    pageInfo?: PageInfo;
    found?: number | null;
}

export interface AuctionProductsNode {
    databaseId: number;
    title: string;
    shortDescription: string;
    slug: string;
    type: string;
    salePrice: null;
    regularPrice: string;
    price: string;
    featuredImage: FeaturedImage;
    uri: string;
    link: string;
    dateStart: Date;
    dateEnd: Date;
    startPrice: string;
    reservedPrice: string;
    nextBids: string;
    bidIncrement: string;
    auctionCondition: string;
    currentBid: string;
}

export interface PageInfo {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor: string;
    endCursor: string;
}

export interface FeaturedImage {
    node: FeaturedImageNode;
}

export interface FeaturedImageNode {
    sourceUrl: string;
    srcSet: string;
}

export interface MenuItems {
    nodes: MenuItemsNode[] | [];
}

export interface MenuItemsNode {
    title: null;
    uri: string;
    url: string;
    label: string;
    order: number;
    path: string;
    isParent?: boolean;
    parentDatabaseId: number;
    databaseId: number;
    children?: MenuItemsNode[];
}

export interface Variables {
    status?: Status;
    slug?: string;
    orderby?: Orderby;
    first?: number;
    after?: number;
    field?: string;
    order?: string;
}

export interface MetadataClass {
    seo: SEO;
}

export interface SEO {
    title:       string;
    openGraph:   OpenGraph;
    description: string;
    robots:      string[];
}

export interface OpenGraph {
    url:         string;
    type:        "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other";
    title:       string;
    description: string;
    siteName:    string;
    twitterMeta: TwitterMeta;
    locale:      string;
    image?:       string;
    updatedTime: Date;
}

export interface TwitterMeta {
    card:        "summary" | "summary_large_image" | "player" | "app";
    description: string;
    title:       string;
    site?:       string;
    image?:      string;
    creator?:     string;
}

export interface Orderby {
    field: 'DATE'|'TITLE'|'META_VALUE';
    order: 'ASC'|'DESC';
}

export type Status = 'LIVE'|'EXPIRED'|'ENDED'|'ALL';

import { MenuItemsNode } from "@/interfaces/home.interface";

export const buildMenuTree = (menuItems: MenuItemsNode[], isLoggedIn:boolean):MenuItemsNode[] => {
    const menuMap = new Map<number, MenuItemsNode>();

    menuItems.forEach((item) => {
        menuMap.set(item.databaseId, {...item, children: []});
    });

    const tree:MenuItemsNode[] = [];
    menuMap.forEach((item) => {
        if(item.label === 'Logout' && !isLoggedIn){
            return;
        }
        
        if(item.parentDatabaseId === 0) {
            tree.push(item);
        } else {
            const key = item.parentDatabaseId;
            const parent = menuMap.get(key);
            if (parent) {
                parent.isParent = true;
                menuMap.set(key, parent);
                parent.children?.push(item);
            }
        }
    });

    return tree;
}
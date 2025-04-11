import { MenuItemsNode } from "@/interfaces";
import { buildMenuTree } from "@/utils/buildMenuTree";
import { Menu } from "@/components";
import { isLogged } from "@/actions";

interface Props {
  menuItems: MenuItemsNode[];
}

export const Header = async ({ menuItems }: Props) => {
  const isLoggedIn = await isLogged();
  const tree = buildMenuTree(menuItems, isLoggedIn);
  console.log("isLoggedIn", isLoggedIn);

  return <Menu menuTree={tree} />;
};

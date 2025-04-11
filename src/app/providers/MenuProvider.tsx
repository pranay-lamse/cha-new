// app/providers/MenuProvider.tsx
"use server";

import { getMenus } from "@/actions";

export async function MenuProvider({
  children,
}: {
  children: (menuItems: any) => React.ReactNode;
}) {
  const { menuItems } = await getMenus();
  return <>{children(menuItems.nodes)}</>;
}

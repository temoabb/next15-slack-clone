import { usePathname } from "next/navigation";

import {
  BellIcon,
  Home,
  MessageSquareIcon,
  MoreHorizontal,
} from "lucide-react";

import UserButton from "@/features/auth/components/UserButton";

import SidebarButton from "./sidebar-button";
import WorkspaceSwitcher from "./workspace-switcher";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace")}
      />
      <SidebarButton icon={MessageSquareIcon} label="Dms" />
      <SidebarButton icon={BellIcon} label="Activity" />
      <SidebarButton icon={MoreHorizontal} label="More" />

      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;

"use client";
import { useRouter } from "next/navigation";

import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useCurrentUser from "../api/useCurrentUser";

const UserButton = () => {
  const router = useRouter();

  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();

  if (isLoading) {
    return <Loader className="size-4 aninate-spin text-muted-foreground" />;
  }

  if (!data) {
    return null;
  }

  const { name, image } = data;
  const avatarFallback = name!.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    await signOut();

    // TODO: Sometimes it still causes an error, if user is logged in with Gmail or GitHub
    router.push("/auth");
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="rounded-md size-10 hover:opacity-75 transition">
            <AvatarImage className="rounded-md" alt="name" src={image || ""} />
            <AvatarFallback className="rounded-md bg-sky-500 text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="right" className="w-60">
          <DropdownMenuItem className="h-10" onClick={handleSignOut}>
            <LogOut className="size-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserButton;

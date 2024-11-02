"use client";
import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  const { signOut } = useAuthActions();

  return (
    <>
      <h1>Logged in!</h1>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </>
  );
}

// If component is a client component ("use client") and it is a wrapper on the {children}, it does not mean children and their children need to be a client components. They can be SERVER components too.

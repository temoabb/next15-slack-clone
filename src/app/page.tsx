"use client";
import UserButton from "@/features/auth/components/UserButton";

// If component is a client component ("use client") and it is a wrapper on the {children}, it does not mean children and their children need to be a client components. They can be SERVER components too.

export default function Home() {
  return (
    <div>
      <UserButton />
    </div>
  );
}

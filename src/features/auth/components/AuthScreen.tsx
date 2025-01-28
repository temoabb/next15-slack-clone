"use client";

import { useState } from "react";

import { SignInFlow } from "../types";

import { SignInCard } from "./SignInCard";
import { SignUpCard } from "./SignUpcard";

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="h-full flex items-center justify-center bg-[#5c3858]">
      <div className="md:h-auto md:w-[420ppx]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

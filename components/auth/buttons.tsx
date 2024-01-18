"use client";

import { Button } from "@/components/ui/button";

import {
  signIn,
  signOut,
  getProviders,
  LiteralUnion,
  ClientSafeProvider,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers/index";
import { useState, useEffect } from "react";

export const LoginButton = () => {
  const [providers, setProviders] = useState<Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null>(null);

  useEffect(() => {
    const setupProviders = async () => {
      const resp = await getProviders();
      setProviders(resp);
    };
    setupProviders();
  }, []);

  return (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <Button
            variant={"secondary"}
            size={"sm"}
            key={provider.name}
            onClick={() => signIn(provider.id, { callbackUrl: "/" })}
          >
            Sign In
          </Button>
        ))}
    </>
  );
};

export const LogoutButton = () => {
  return (
    <Button variant={"secondary"} size={"sm"} onClick={() => signOut()}>
      Sign Out
    </Button>
  );
};

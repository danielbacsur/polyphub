"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import Balancer from "react-wrap-balancer";
import { Button } from "./ui/button";

export default function GoogleOAuthButton() {
  const [loading, setLoading] = useState(false);

  const redirectToGoogleOAuth = () => {
    setLoading(true);
    signIn("google");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      redirectToGoogleOAuth()
    },6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col space-y-4 lg:space-y-8 text-center">
      <h1 className="text-2xl lg:text-3xl font-bold">Welcome</h1>

      <Balancer className="max-w-lg">
        In order to use the app, you need to login with your Google account.
        This is necessary to prevent abuse of the app and to let us know who you
        are.
      </Balancer>

      <Button disabled={loading} onClick={redirectToGoogleOAuth}>
        {loading ? <p>Loading</p> : <p>Login with Google</p>}
      </Button>
    </div>
  );
}

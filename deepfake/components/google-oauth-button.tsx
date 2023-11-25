"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GoogleOAuthButton() {
  const [loading, setLoading] = useState(false);

  const redirectToGoogleOAuth = () => {
    setLoading(true);
    signIn("google");
  };

  return (
    <button disabled={loading} onClick={redirectToGoogleOAuth}>
      {loading ? <p>Loading</p> : <p>Login with Google</p>}
    </button>
  );
}

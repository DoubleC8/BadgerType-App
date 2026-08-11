import { useUser } from "@clerk/react";
import { useEffect } from "react";

const AuthSync = () => {
  // Clerk provides this hook to give us all the logged-in user's data
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Dial the new FastAPI route
      fetch(
        "https://badgertype-backend-597162430503.us-west2.run.app/api/auth/sync",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerk_id: user.id,
            // Fallback logic because GitHub might not provide a username immediately
            username:
              user.username || user.firstName || `user_${user.id.slice(0, 6)}`,
            profile_picture: user.imageUrl,
          }),
        },
      ).catch((err) => console.error("Failed to sync user with Neon:", err));
    }
  }, [isLoaded, isSignedIn, user]);

  // This component is entirely invisible!
  return null;
};

export default AuthSync;

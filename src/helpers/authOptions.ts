import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// Minimal JWT decode (no verification) to extract payload fields
const decodeJwtPayload = (token?: string) => {
  if (!token) return {};
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(normalized, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Failed to decode JWT payload", e);
    return {};
  }
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullName?: string | null;
      email?: string | null;
      role?: string;
      image?: string | null;
    };
    accessToken?: string;
    refreshToken?: string;
  }
  interface User {
    id: string;
    fullName?: string | null;
    email?: string | null;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    fullName?: string;
    email?: string;
    role?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error("Email or Password is missing");
          throw new Error("Email or password is missing");
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!res?.ok) {
            let message = "Login failed";
            try {
              const errBody = await res.json();
              message = errBody?.message || message;
            } catch (e) {
              message = await res.text();
            }
            console.error("Login Failed", message);
            throw new Error(message || "Invalid credentials");
          }

          const response = await res.json();
          console.log("User response:", response);

          // API returns { message, data: { accessToken, refreshToken, ... } }
          const data = response?.data || response;

          // Extract tokens directly from data object (they are at top level in response.data)
          const accessToken = data?.accessToken;
          const refreshToken = data?.refreshToken;

          const payload = decodeJwtPayload(accessToken as string | undefined);
          console.log("Decoded JWT payload:", payload);

          // Extract user info - prioritize JWT payload for role
          const user = data?.user || data;

          const id = payload?.id || payload?._id || user?.id || user?._id;
          const fullName = payload?.name || user?.fullName || user?.name;
          const email = payload?.email || user?.email;
          const role = payload?.role || user?.role || "USER";

          console.log("Extracted user info:", { id, fullName, email, role });

          if (!id || !accessToken) {
            console.error("Missing id or accessToken in login response", {
              id,
              hasAccessToken: Boolean(accessToken),
              hasRefreshToken: Boolean(refreshToken),
              user,
              payload,
              response,
            });
            throw new Error("Invalid login response from server");
          }

          return {
            id,
            fullName,
            email,
            role,
            accessToken,
            refreshToken,
          };
        } catch (err) {
          console.error("Authorize Error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial login - set all user data and tokens
        token.id = user.id;
        token.fullName = user.fullName || "";
        token.email = user.email || "";
        token.role = (user as { role?: string }).role || "USER";
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.refreshToken = (user as { refreshToken?: string }).refreshToken;

        console.log("JWT callback - User login:", {
          id: token.id,
          role: token.role,
          hasAccessToken: Boolean(token.accessToken),
        });
      } else {
        // Refresh token call - preserve existing tokens
        console.log("JWT callback - Token refresh:", {
          id: token.id,
          role: token.role,
          hasAccessToken: Boolean(token.accessToken),
        });
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.fullName = token.fullName as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      // Always include tokens from JWT - ensure they're always set
      session.accessToken = (token.accessToken as string) || "";
      session.refreshToken = (token.refreshToken as string) || "";

      // Debug log for token presence
      if (!session.accessToken) {
        console.warn("Warning: accessToken missing in session", {
          tokenKeys: Object.keys(token),
          tokenAccessToken: token.accessToken,
        });
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle callback URL parameter
      if (url.includes("callbackUrl")) {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        const callbackUrl = urlParams.get("callbackUrl");
        if (callbackUrl) {
          return decodeURIComponent(callbackUrl);
        }
      }

      // If url is a relative path, prepend baseUrl
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // If url is same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }

      // Default redirect to dashboard after login
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

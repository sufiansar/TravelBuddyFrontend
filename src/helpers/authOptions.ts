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
          return null;
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
            console.error("Login Failed", await res.text());
            return null;
          }

          const response = await res.json();

          const data = response?.data || response;

          // Extract tokens directly from data object
          const accessToken = data?.accessToken;
          const refreshToken = data?.refreshToken;

          const payload = decodeJwtPayload(accessToken as string | undefined);

          const user = data?.user || data;

          const id = payload?.id || payload?._id || user?.id || user?._id;
          const fullName = payload?.name || user?.fullName || user?.name;
          const email = payload?.email || user?.email;
          const role = payload?.role || user?.role || "USER";

          if (!id || !accessToken) {
            console.error("Missing id or accessToken in login response", {
              id,
              hasAccessToken: Boolean(accessToken),
              hasRefreshToken: Boolean(refreshToken),
              user,
              payload,
              response,
            });
            return null;
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
      } else {
        // Refresh token call - preserve existing tokens

        console.log("Token ID:", token.id);
        console.log("Has accessToken:", Boolean(token.accessToken));
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

      // Only set tokens if they actually exist (not empty or undefined)
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.refreshToken) {
        session.refreshToken = token.refreshToken as string;
      }

      if (!session.accessToken || !token.accessToken) {
        console.warn("Warning: accessToken missing", {
          tokenKeys: Object.keys(token),
          tokenAccessToken: token.accessToken,
          sessionAccessToken: session.accessToken,
        });
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      // Handle callback URL parameter - support both 'redirect' and 'callbackUrl'
      if (url.includes("?")) {
        const urlParams = new URLSearchParams(url.split("?")[1]);
        const callbackUrl =
          urlParams.get("redirect") || urlParams.get("callbackUrl");
        if (callbackUrl && callbackUrl.startsWith("/")) {
          return `${baseUrl}${decodeURIComponent(callbackUrl)}`;
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

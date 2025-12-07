import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMyProfile } from "@/actions";
import { getUserSession } from "@/helpers/userSession";

const decodeJwtPayload = (token?: string) => {
  if (!token) return {} as Record<string, any>;
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = Buffer.from(normalized, "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return {} as Record<string, any>;
  }
};

export interface UserProfile {
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  gender?: string;
  bio?: string;
  profileImage?: string;
  currentLocation?: string;
  visitedCountries?: string[];
  travelInterests?: string[];
  interests?: string[];
  verifiedBadge?: boolean;
  isPublic?: boolean;
  travelPlans?: any[];
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  reviewCount?: number;
}

export default async function MyProfilePage() {
  const session = await getUserSession();
  const tokenPayload = decodeJwtPayload(session?.accessToken);

  const result = await getMyProfile();
  const profile =
    (result.success ? (result.data as UserProfile) : null) ?? null;

  if (!profile && !session?.accessToken)
    return <div className="p-8 text-center">Profile not found</div>;

  const effectiveProfile: UserProfile = profile || {
    id: tokenPayload?.id || tokenPayload?._id,
    fullName: tokenPayload?.name,
    email: tokenPayload?.email,
    role: tokenPayload?.role,
    profileImage: undefined,
    currentLocation: undefined,
    visitedCountries: undefined,
    travelInterests: undefined,
    interests: undefined,
    rating: undefined,
    reviewCount: undefined,
  };

  const displayInterests =
    effectiveProfile.travelInterests || effectiveProfile.interests || [];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start mb-8">
        <h1 className="text-4xl font-bold">My Profile</h1>
        <Link href="/profile/edit">
          <Button className="bg-primary hover:bg-primary/90">
            Edit Profile
          </Button>
        </Link>
      </div>
      <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
        <div className="bg-linear-to-r from-primary/80 to-primary h-32"></div>

        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row gap-8 -mt-16 mb-8">
            <div>
              {effectiveProfile?.profileImage ? (
                <img
                  src={effectiveProfile.profileImage}
                  alt={effectiveProfile.fullName || "Profile"}
                  className="w-40 h-40 rounded-lg object-cover border-4 border-card shadow-lg"
                />
              ) : (
                <div className="w-40 h-40 rounded-lg bg-primary/30 border-4 border-card shadow-lg" />
              )}
            </div>

            <div className="flex-1 pt-8 space-y-2">
              <h2 className="text-3xl font-bold">
                {effectiveProfile.fullName || "Traveler"}
              </h2>
              {effectiveProfile.email && (
                <p className="text-muted-foreground">
                  {effectiveProfile.email}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {effectiveProfile.role && (
                  <span>Role: {effectiveProfile.role}</span>
                )}
                {effectiveProfile.gender && (
                  <span>Gender: {effectiveProfile.gender}</span>
                )}
                {effectiveProfile.verifiedBadge && (
                  <span className="text-primary">✔ Verified</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>⭐ {effectiveProfile.rating ?? "N/A"}</span>
                <span>Reviews: {effectiveProfile.reviewCount ?? 0}</span>
                {effectiveProfile.currentLocation && (
                  <span>📍 {effectiveProfile.currentLocation}</span>
                )}
              </div>
            </div>
          </div>

          {effectiveProfile.bio && (
            <div className="mb-8 space-y-2">
              <h3 className="text-xl font-semibold">About Me</h3>
              <p className="text-muted-foreground leading-relaxed">
                {effectiveProfile.bio}
              </p>
            </div>
          )}

          {effectiveProfile.travelInterests &&
            effectiveProfile.travelInterests.length > 0 && (
              <div className="mb-8 space-y-3">
                <h3 className="text-xl font-semibold">Travel Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {effectiveProfile.travelInterests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {effectiveProfile.visitedCountries &&
            effectiveProfile.visitedCountries.length > 0 && (
              <div className="mb-8 space-y-3">
                <h3 className="text-xl font-semibold">Visited Countries</h3>
                <div className="flex flex-wrap gap-2">
                  {effectiveProfile.visitedCountries.map((country) => (
                    <span
                      key={country}
                      className="bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100 px-3 py-1 rounded-full text-sm"
                    >
                      {country}
                    </span>
                  ))}
                </div>
              </div>
            )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 pt-6 border-t border-border">
            <div className="space-y-1">
              <p className="text-muted-foreground">Traveled to</p>
              <p className="text-2xl font-bold">
                {effectiveProfile.visitedCountries?.length || 0}
              </p>
              <p className="text-sm text-muted-foreground">countries</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Member Since</p>
              <p className="text-2xl font-bold">—</p>
              <p className="text-sm text-muted-foreground">on TravelBuddy</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Active Plans</p>
              <p className="text-2xl font-bold">—</p>
              <p className="text-sm text-muted-foreground">upcoming trips</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

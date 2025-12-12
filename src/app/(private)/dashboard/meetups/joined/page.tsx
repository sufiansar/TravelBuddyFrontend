import { getAllMeetups } from "@/actions";
import { MeetupCard } from "@/components/modules/MeetUp/MeetupCard";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";

export default async function JoinedMeetupsPage() {
  // Use server-side session helper
  const { getUserSession } = await import("@/helpers/userSession");
  const session = await getUserSession();
  const userId = session?.user?.id;

  const result = await getAllMeetups({}, {});

  if (!result.success) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg font-semibold mb-2">Failed to load meetups</p>
        <p className="text-muted-foreground mb-4">{result.error}</p>
        <Link href="/dashboard/meetups">
          <Button variant="outline">Back to Meetups</Button>
        </Link>
      </div>
    );
  }

  const all = result.data || [];
  const joined = all.filter(
    (meetup: any) =>
      meetup?.host?.id !== userId &&
      Array.isArray(meetup?.participants) &&
      meetup.participants.some((p: any) => p?.user?.id === userId)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Joined Meetups</h1>
          <p className="text-gray-600">
            Meetups you have joined as a participant.
          </p>
        </div>
        <Link href="/dashboard/meetups">
          <Button variant="outline">Back to Meetups</Button>
        </Link>
      </div>

      {joined.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No joined meetups</h3>
          <p className="text-gray-600 mb-4">
            Join meetups to connect with other travelers!
          </p>
          <Link href="/dashboard/meetups">
            <Button>Browse Meetups</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {joined.map((meetup: any) => (
            <MeetupCard
              key={meetup.id}
              meetup={meetup}
              isHost={false}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

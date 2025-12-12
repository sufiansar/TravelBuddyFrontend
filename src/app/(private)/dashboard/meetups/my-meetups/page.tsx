"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Calendar, MapPin, Users, Plus } from "lucide-react";
import Link from "next/link";

import { deleteMeetup, getAllMeetups } from "@/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MeetupCard } from "@/components/modules/MeetUp/MeetupCard";
import { Meetup } from "@/types/meetup.interface";

export default function MyMeetupsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [myMeetups, setMyMeetups] = useState<Meetup[]>([]);
  const [joinedMeetups, setJoinedMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"created" | "joined">("created");

  useEffect(() => {
    fetchMyMeetups();
  }, []);

  const fetchMyMeetups = async () => {
    setLoading(true);
    try {
      const result = await getAllMeetups({}, {});
      if (result.success) {
        const allMeetups = result.data;

        const created = allMeetups.filter(
          (meetup: any) => meetup.host.id === userId
        );
        const joined = allMeetups.filter(
          (meetup: any) =>
            meetup.participants.some((p: any) => p.user.id === userId) &&
            meetup.host.id !== userId
        );

        setMyMeetups(created);
        setJoinedMeetups(joined);
      }
    } catch (error) {
      toast.error("Failed to fetch meetups");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeetup = async (meetupId: string) => {
    try {
      const result = await deleteMeetup(meetupId);
      if (result.success) {
        toast.success("Meetup deleted successfully");
        fetchMyMeetups();
      } else {
        toast.error("Failed to delete meetup");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the meetup");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Meetups</h1>
          <p className="text-gray-600">
            Manage your created and joined meetups
          </p>
        </div>
        <Link href="/meetups/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Meetup
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("created")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "created"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Created ({myMeetups.length})
            </button>
            <button
              onClick={() => setActiveTab("joined")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "joined"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Joined ({joinedMeetups.length})
            </button>
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : activeTab === "created" ? (
        <>
          {myMeetups.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No meetups created yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first meetup and start connecting with people!
              </p>
              <Link href="/meetups/create">
                <Button>Create Your First Meetup</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myMeetups.map((meetup) => (
                <MeetupCard
                  key={meetup.id}
                  meetup={meetup}
                  isHost={true}
                  onJoin={() => handleDeleteMeetup(meetup.id)}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {joinedMeetups.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No joined meetups</h3>
              <p className="text-gray-600 mb-4">
                Join meetups to connect with other travelers!
              </p>
              <Link href="/meetups">
                <Button>Browse Meetups</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedMeetups.map((meetup) => (
                <MeetupCard key={meetup.id} meetup={meetup} isHost={false} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

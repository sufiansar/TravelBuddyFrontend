"use client";

import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import Link from "next/link";

import { toast } from "sonner";
import { MeetupFilters } from "@/components/modules/MeetUp/MeetupFilters";
import { MeetupCard } from "@/components/modules/MeetUp/MeetupCard";
import { Pagination } from "@/components/Shared/Pagination";
import { Meetup } from "@/types/meetup.interface";
import { getAllMeetups, joinMeetup, leaveMeetup } from "@/actions";
export default function MeetupsPage() {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
  });

  const fetchMeetups = async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const result = await getAllMeetups(filters, {
        page,
        limit: pagination.limit,
        sortBy: "date",
        sortOrder: "asc",
      });
      console.log(result, "MeetUp");
      if (result.success) {
        setMeetups(result?.data || []);
        setPagination({
          page: result.meta?.page || 1,
          limit: result.meta?.limit || 9,
          total: result.meta?.total || 0,
        });
      } else {
        toast.error(result.error || "Failed to load meetups");
      }
    } catch (error) {
      toast.error("Failed to load meetups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetups();
  }, []);

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
    fetchMeetups(1, newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchMeetups(page, filters);
  };

  const handleJoinMeetup = async (meetupId: string) => {
    try {
      const result = await joinMeetup(meetupId);
      console.log(result);
      if (result.success) {
        toast.success("Successfully joined the meetup!");
        fetchMeetups(pagination.page, filters);
      } else {
        toast.error(result.error || "Failed to join meetup");
      }
    } catch (error) {
      toast.error("Failed to join meetup");
    }
  };

  const handleLeaveMeetup = async (meetupId: string) => {
    try {
      const result = await leaveMeetup(meetupId);
      if (result.success) {
        toast.success("Successfully left the meetup!");
        fetchMeetups(pagination.page, filters);
      } else {
        toast.error(result.error || "Failed to leave meetup");
      }
    } catch (error) {
      toast.error("Failed to leave meetup");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meetups</h1>
          <p className="text-gray-600">Discover and join amazing meetups</p>
        </div>
        <Link href="/meetups/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Meetup
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <MeetupFilters onFilter={handleFilter} isLoading={loading} />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : meetups?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No meetups found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your filters or create the first meetup!
          </p>
          <Link href="/meetups/create">
            <Button>Create First Meetup</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {meetups.map((meetup) => (
              <MeetupCard
                key={meetup.id}
                meetup={meetup}
                onJoin={handleJoinMeetup}
                onLeave={handleLeaveMeetup}
              />
            ))}
          </div>

          {pagination.total > pagination.limit && (
            <Pagination
              currentPage={pagination.page}
              totalPages={Math.ceil(pagination.total / pagination.limit)}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

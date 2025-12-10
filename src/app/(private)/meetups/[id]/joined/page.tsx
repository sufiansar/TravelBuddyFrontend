"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getMeetupMembers } from "@/actions/meetups/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

interface Member {
  id: string;
  userId: string;
  meetupId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    profileImage?: string;
  };
  createdAt?: Date;
}

export default function JoinedMembersPage() {
  const params = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const result = await getMeetupMembers(params.id as string);
        if (result.success && result.data) {
          setMembers(result.data);
        } else {
          setError(result.error || "Failed to load members");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchMembers();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Joined Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-gray-500">No members have joined yet</p>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={member.user.profileImage}
                        alt={member.user.fullName}
                      />
                      <AvatarFallback>
                        {member.user.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.user.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                  {member.createdAt && (
                    <p className="text-sm text-gray-500">
                      Joined {format(new Date(member.createdAt), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

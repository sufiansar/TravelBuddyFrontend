"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, User, Crown, Calendar } from "lucide-react";

import { format } from "date-fns";

import { getMeetupMembers } from "@/actions";
import { toast } from "sonner";
import { MeetupMember } from "@/types/meetup.interface";

interface MeetupMembersProps {
  meetupId: string;
  showSearch?: boolean;
  maxVisible?: number;
}

export function MeetupMembers({
  meetupId,
  showSearch = true,
  maxVisible = 10,
}: MeetupMembersProps) {
  const [members, setMembers] = useState<MeetupMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MeetupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [meetupId]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.user.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          member.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchTerm, members]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const result: any = await getMeetupMembers(meetupId);
      if (result.success) {
        setMembers(result.data);
        setFilteredMembers(result.data);
      } else {
        toast.error(result.error || "Failed to load members");
      }
    } catch (error) {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  const displayedMembers = showAll
    ? filteredMembers
    : filteredMembers.slice(0, maxVisible);

  const hasMoreMembers = filteredMembers.length > maxVisible;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showSearch && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-6">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No members found</p>
            {searchTerm && (
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={member.user.profileImage}
                        alt={member.user.fullName}
                      />
                      <AvatarFallback>
                        {member.user.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {member.user.fullName}
                        </span>
                        {member.user.role === "ADMIN" && (
                          <Badge variant="secondary" className="text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Joined{" "}
                          {format(new Date(member?.createdAt!), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{member.user.email}</Badge>
                </div>
              ))}
            </div>

            {hasMoreMembers && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="w-full"
                >
                  {showAll
                    ? "Show Less"
                    : `Show All (${filteredMembers.length})`}
                </Button>
              </div>
            )}

            <div className="mt-6 pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg">{members.length}</div>
                  <div className="text-gray-500">Total Members</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg">
                    {members.filter((m) => m.user.role === "ADMIN").length}
                  </div>
                  <div className="text-gray-500">Admins</div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

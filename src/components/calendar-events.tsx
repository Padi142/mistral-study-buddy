"use client";

import { useState, useEffect, useCallback } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select } from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Plus,
  Calendar,
  BookOpen,
  FileText,
  GraduationCap,
} from "lucide-react";
import type { CalendarEntry } from "~/lib/types/calendar";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";

const eventTypeIcons = {
  exam: GraduationCap,
  assignment: FileText,
  lecture: BookOpen,
  study: Calendar,
};

const eventTypeColors = {
  exam: "bg-red-100 text-red-700 border-red-200",
  assignment: "bg-amber-100 text-amber-700 border-amber-200",
  lecture: "bg-blue-100 text-blue-700 border-blue-200",
  study: "bg-green-100 text-green-700 border-green-200",
};

export function CalendarEvents() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEntry, "id">>({
    date: "",
    subject: "",
    type: "study",
    description: "",
  });

  const calendarEntries = useQuery(api.calendar_entries.get);

  const handleAddEvent = () => {
    if (!newEvent.date || !newEvent.subject) return;

    const event: CalendarEntry = {
      ...newEvent,
      id: crypto.randomUUID(),
    };

    setNewEvent({ date: "", subject: "", type: "study", description: "" });
    setIsModalOpen(false);
  };

  const handleRemoveEvent = (id: string) => {};

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-700">
          Scheduled Events
        </h2>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Schedule New Event</DialogTitle>
              <DialogDescription>
                Add a new study event, exam, assignment, or lecture to your
                calendar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="e.g., Mathematics, Physics..."
                  value={newEvent.subject}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  id="type"
                  value={newEvent.type}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      type: e.target.value as CalendarEntry["type"],
                    }))
                  }
                >
                  <option value="study">Study Session</option>
                  <option value="exam">Exam</option>
                  <option value="assignment">Assignment</option>
                  <option value="lecture">Lecture</option>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input
                  id="description"
                  placeholder="Add any notes..."
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleAddEvent}
                disabled={!newEvent.date || !newEvent.subject}
              >
                Add Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      {calendarEntries?.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">No events scheduled yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {calendarEntries?.map((entry) => {
            const Icon =
              eventTypeIcons[entry.type as keyof typeof eventTypeIcons];
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-4 rounded-lg border p-4 ${eventTypeColors[entry.type as keyof typeof eventTypeColors]}`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/50">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{entry.subject}</div>
                  <div className="text-sm opacity-80">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {entry.description && (
                    <div className="mt-1 text-sm opacity-70">
                      {entry.description}
                    </div>
                  )}
                </div>
                <div className="text-xs font-medium tracking-wide uppercase opacity-60">
                  {entry.type}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-60 hover:opacity-100"
                  onClick={() => handleRemoveEvent(entry.id)}
                >
                  ×
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

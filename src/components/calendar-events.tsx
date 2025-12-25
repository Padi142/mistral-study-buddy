"use client";

import { useState, useMemo } from "react";
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
  X,
} from "lucide-react";
import type { CalendarEntry } from "~/lib/types/calendar";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const eventTypeIcons = {
  exam: GraduationCap,
  assignment: FileText,
  lecture: BookOpen,
  study: Calendar,
};

const eventTypeBorderColors = {
  exam: "border-l-red-500",
  assignment: "border-l-amber-500",
  lecture: "border-l-blue-500",
  study: "border-l-emerald-500",
};

const eventTypeIconColors = {
  exam: "text-red-500",
  assignment: "text-amber-500",
  lecture: "text-blue-500",
  study: "text-emerald-500",
};

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) return "Today";
  if (isTomorrow) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getDateKey(dateStr: string): string {
  return new Date(dateStr).toDateString();
}

type GroupedEvents = { label: string; events: CalendarEntry[] }[];

function groupEventsByDate(entries: CalendarEntry[]): GroupedEvents {
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const groups: Map<string, { label: string; events: CalendarEntry[] }> =
    new Map();

  for (const entry of sorted) {
    const key = getDateKey(entry.date);
    if (!groups.has(key)) {
      groups.set(key, { label: getDateLabel(entry.date), events: [] });
    }
    groups.get(key)!.events.push(entry);
  }

  return Array.from(groups.values());
}

export function CalendarEvents() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEntry, "id">>({
    date: "",
    subject: "",
    type: "study",
    description: "",
  });

  const calendarEntries = useQuery(api.calendar_entries.get);

  const groupedEvents = useMemo(() => {
    if (!calendarEntries) return [];
    return groupEventsByDate(calendarEntries as CalendarEntry[]);
  }, [calendarEntries]);

  const handleAddEvent = () => {
    if (!newEvent.date || !newEvent.subject) return;
    setNewEvent({ date: "", subject: "", type: "study", description: "" });
    setIsModalOpen(false);
  };

  const handleRemoveEvent = (id: string) => {};

  const eventCount = calendarEntries?.length ?? 0;

  return (
    <div className="flex h-[680px] flex-col rounded-xl border border-white/30 bg-white/60 shadow-lg backdrop-blur-md">
      <div className="flex shrink-0 items-center justify-between border-b border-white/20 px-4 py-3">
        <div>
          <h2 className="font-semibold text-gray-800">Scheduled Events</h2>
          <p className="text-xs text-gray-500">
            {eventCount} {eventCount === 1 ? "event" : "events"} upcoming
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="h-8 gap-1 bg-indigo-600 text-xs hover:bg-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
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
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={handleAddEvent}
                disabled={!newEvent.date || !newEvent.subject}
              >
                Add Event
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto">
        {eventCount === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-gray-100 p-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mt-3 text-sm font-medium text-gray-600">
              No events scheduled
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Add your first event to get started
            </p>
          </div>
        ) : (
          <div className="p-2">
            {groupedEvents.map((group) => (
              <div key={group.label} className="mb-3">
                <div className="sticky top-0 z-10 bg-linear-to-r from-white/80 to-transparent px-2 py-1.5 backdrop-blur-sm">
                  <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                    {group.label}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {group.events.map((entry) => {
                    const Icon =
                      eventTypeIcons[entry.type as keyof typeof eventTypeIcons];
                    const borderColor =
                      eventTypeBorderColors[
                        entry.type as keyof typeof eventTypeBorderColors
                      ];
                    const iconColor =
                      eventTypeIconColors[
                        entry.type as keyof typeof eventTypeIconColors
                      ];

                    return (
                      <div
                        key={entry.id}
                        className={`group relative flex items-start gap-3 rounded-lg border-l-[3px] bg-white/70 px-3 py-2.5 transition-all duration-200 hover:bg-white hover:shadow-sm ${borderColor}`}
                      >
                        <div className={`mt-0.5 shrink-0 ${iconColor}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="truncate text-sm font-medium text-gray-800">
                              {entry.subject}
                            </span>
                            <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-gray-500 uppercase">
                              {entry.type}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-gray-500">
                            {new Date(entry.date).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </div>
                          {entry.description && (
                            <div className="mt-1 line-clamp-2 text-xs text-gray-400">
                              {entry.description}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveEvent(entry.id)}
                          className="absolute top-1 right-1 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50"
                        >
                          <X className="h-3.5 w-3.5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

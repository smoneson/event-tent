"use client";

import React, { useEffect, useState } from "react";
import { Event } from "@prisma/client";

const EventsTable = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch("/api/events");
      const data: Event[] = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Event Name</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Location</th>
            <th className="px-4 py-2 border-b">Description</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event: Event) => (
            <tr key={event.id}>
              <td className="border px-4 py-2">{event.title}</td>
              <td className="border px-4 py-2">
                {new Date(event.date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">{event.location}</td>
              <td className="border px-4 py-2">{event.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;

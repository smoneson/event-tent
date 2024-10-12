"use client";

import React from "react";
import EventsTable from "./EventTable";

const EventPage = () => {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <EventsTable />
    </main>
  );
};

export default EventPage;

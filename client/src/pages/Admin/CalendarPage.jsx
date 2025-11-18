import React, { useState, useMemo, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CalendarDays, Plus, X, Trash2 } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";
import API from "../../utils/api";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openPopup, setOpenPopup] = useState(false);
  const [newNote, setNewNote] = useState({ time: "", title: "" });
  const [editingEventId, setEditingEventId] = useState(null);

  // REAL EVENTS FROM DB
  const [events, setEvents] = useState([]);

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // ===================================================
  // FETCH EVENTS FROM BACKEND
  // ===================================================
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.get("/calendar", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(data);
    } catch (err) {
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Events for selected day
  const dayEvents = events.filter((n) => n.date === formattedDate);

  // Events for month
  const monthEvents = useMemo(() => {
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    return events.filter((n) => {
      const d = new Date(n.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [events, selectedDate]);

  // ===================================================
  // ADD or EDIT EVENT
  // ===================================================
  const addNote = async () => {
    if (!newNote.time || !newNote.title)
      return toast.error("Please complete all fields!");

    const token = localStorage.getItem("token");

    // --------- EDIT MODE ---------
    if (editingEventId) {
      try {
        const { data } = await API.put(
          `/calendar/${editingEventId}`,
          {
            date: formattedDate,
            time: newNote.time,
            title: newNote.title,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setEvents((prev) =>
          prev.map((e) => (e._id === editingEventId ? data : e))
        );

        toast.success("Event updated!");
      } catch {
        toast.error("Failed to update event");
      }

      setEditingEventId(null);
      setNewNote({ time: "", title: "" });
      setOpenPopup(false);
      return;
    }

    // --------- ADD MODE ---------
    try {
      const { data } = await API.post(
        "/calendar",
        {
          date: formattedDate,
          time: newNote.time,
          title: newNote.title,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prev) => [...prev, data]);
      toast.success("Event added!");
      setNewNote({ time: "", title: "" });
      setOpenPopup(false);
    } catch {
      toast.error("Failed to add event");
    }
  };

  // ===================================================
  // DELETE EVENT
  // ===================================================
  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/calendar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(events.filter((ev) => ev._id !== id));
      toast.success("Event removed");
    } catch {
      toast.error("Failed to delete event");
    }
  };

  // ===================================================
  // UI (UNCHANGED)
  // ===================================================
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white p-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <CalendarDays className="text-[#80FFF9]" size={26} />
            Calendar
          </h1>
          <p className="text-gray-400 text-sm">
            Track meetings, reminders and invoice-related events.
          </p>
        </div>

        {/* NEW EVENT BUTTON */}
        <button
          onClick={() => setOpenPopup(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition flex items-center gap-2"
        >
          <Plus size={16} className="text-indigo-400" />
          New Event
        </button>
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-10">

        {/* === MAIN CALENDAR === */}
        <div className="w-full">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="full-calendar"
            tileClassName={({ date }) => {
              const key = format(date, "yyyy-MM-dd");
              if (events.some((n) => n.date === key)) return "has-event";
              if (isSameDay(date, new Date())) return "today-highlight";
              return null;
            }}
          />

          {/* YOUR EXACT STYLING */}
          <style>{`
            .full-calendar {
              width: 100%;
              background: transparent;
              border: none;
              padding: 10px;
              color: #e8e8e8;
            }
            .full-calendar .react-calendar__month-view__days {
              display: grid !important;
              grid-template-columns: repeat(7, 1fr) !important;
              gap: 6px !important;
            }
            .full-calendar .react-calendar__tile {
              height: 120px;
              border-radius: 18px;
              background: #131313;
              border: 1px solid #1f1f1f;
              transition: 0.2s;
              padding: 12px;
              font-size: 1rem;
            }
            .full-calendar .react-calendar__tile:hover {
              background: #1b1b1b;
              cursor: pointer;
            }
            .react-calendar__navigation button {
              color: #80FFF9;
              background: transparent !important;
            }
            .react-calendar__navigation button:hover {
              background: #1b1b1b !important;
            }
            .has-event {
              background: rgba(79, 70, 229, 0.25) !important;
              border: 1px solid rgba(79, 70, 229, 0.4) !important;
              color: rgb(129, 140, 248) !important;
              font-weight: 600;
            }
            .today-highlight {
              outline: 2px solid #80FFF9;
              outline-offset: -3px;
            }
          `}</style>
        </div>

        {/* === RIGHT SIDEBAR === */}
        <div className="flex flex-col gap-6">

          {/* MINI CALENDAR */}
          <div className="bg-[#111]/60 border border-white/10 rounded-2xl p-5 shadow-lg">
            <Calendar
              value={selectedDate}
              className="mini-calendar"
              tileDisabled={() => true}
              navigationLabel={({ date }) => format(date, "MMMM yyyy")}
              next2Label={null}
              nextLabel={null}
              prevLabel={null}
              prev2Label={null}
            />

            <style>{`
              .mini-calendar {
                background: transparent !important;
                border: none !important;
                color: white !important;
              }
              .mini-calendar .react-calendar__tile {
                background: transparent !important;
                color: white !important;
                border-radius: 10px;
                padding: 10px;
                transition: 0.15s;
              }
              .mini-calendar .react-calendar__tile:hover {
                background: rgba(255,255,255,0.05) !important;
              }
              .mini-calendar .react-calendar__tile--now {
                background: rgba(79, 70, 229, 0.25) !important;
                border: 1px solid rgba(79, 70, 229, 0.40) !important;
                color: white !important;
              }
              .mini-calendar .react-calendar__month-view__days__day--neighboringMonth {
                color: #555 !important;
              }
              .mini-calendar .react-calendar__navigation button {
                background: transparent !important;
                color: #CB52D4 !important;
                font-weight: 600;
                font-size: 1.1rem;
              }
            `}</style>
          </div>

          {/* MONTH EVENTS */}
          <div className="bg-[#111]/60 border border-white/10 rounded-2xl p-6 shadow-lg flex flex-col">
            <h2 className="text-lg font-semibold mb-3"> Events this month</h2>

            {monthEvents.length === 0 ? (
              <p className="text-gray-500 text-sm">No events this month.</p>
            ) : (
              <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2">
                {monthEvents.map((ev) => (
                  <div
                    key={ev._id}
                    className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 hover:bg-[#222] transition flex justify-between items-center"
                  >
                    <div>
                      <p className="text-indigo-400 text-sm font-semibold">
                        {format(new Date(ev.date), "MMM d")} — {ev.time}
                      </p>
                      <p className="text-gray-300 text-sm">{ev.title}</p>
                    </div>

                    <div className="flex items-center gap-3">

                      {/* EDIT */}
                      <button
                        onClick={() => {
                          setNewNote({ time: ev.time, title: ev.title });
                          setSelectedDate(new Date(ev.date));
                          setEditingEventId(ev._id);
                          setOpenPopup(true);
                        }}
                        className="text-indigo-400 hover:text-indigo-300 transition"
                      >
                        ✏️
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => deleteNote(ev._id)}
                        className="text-red-500 hover:text-red-400 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPUP */}
      {openPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-[#111] p-6 rounded-2xl w-[350px] border border-white/10 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingEventId ? "Edit Event" : "New Event"}
              </h3>
              <X
                className="cursor-pointer hover:text-red-400"
                onClick={() => setOpenPopup(false)}
              />
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="time"
                value={newNote.time}
                onChange={(e) =>
                  setNewNote({ ...newNote, time: e.target.value })
                }
                className="bg-[#0d0d0d] border border-white/10 px-4 py-2 rounded-xl outline-none"
              />

              <input
                type="text"
                placeholder="Event title..."
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                className="bg-[#0d0d0d] border border-white/10 px-4 py-2 rounded-xl outline-none"
              />

              <button
                onClick={addNote}
                className="bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 py-2 rounded-xl flex justify-center items-center gap-2 transition text-indigo-300"
              >
                <Plus size={16} />
                {editingEventId ? "Save Changes" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

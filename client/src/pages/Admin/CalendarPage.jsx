import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  StickyNote,
  Save,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import API from "../../utils/api"; // pentru integrare ulterioară

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState([
    {
      id: 1,
      date: "2025-11-11",
      time: "10:00",
      title: "Send invoice #INV-1023",
    },
    {
      id: 2,
      date: "2025-11-12",
      time: "15:30",
      title: "Meeting with client Alex",
    },
  ]);
  const [newNote, setNewNote] = useState({ time: "", title: "" });

  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const dayNotes = notes.filter((n) => n.date === dateKey);

  const addNote = () => {
    if (!newNote.title || !newNote.time) {
      toast.error("Please fill both time and title!");
      return;
    }
    const newEvent = {
      id: Date.now(),
      date: dateKey,
      ...newNote,
    };
    setNotes([...notes, newEvent]);
    setNewNote({ time: "", title: "" });
    toast.success("Note added!");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast.info("Note deleted");
  };

  const saveNotes = async () => {
    try {
      // exemplu de salvare în backend (opțional)
      await API.post("/calendar/save", { notes });
      toast.success("Notes saved to your account!");
    } catch (err) {
      toast.error("Failed to save notes");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-10">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <CalendarDays className="text-[#80FFF9]" size={26} />
            Calendar & Notes
          </h1>
          <p className="text-gray-400 text-sm">
            Track invoices, meetings, and daily reminders
          </p>
        </div>
        <button
          onClick={saveNotes}
          className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-2 rounded-md hover:opacity-90 transition"
        >
          <Save size={16} /> Save Notes
        </button>
      </div>

      {/* ===== MAIN SECTION ===== */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* ==== LEFT SIDE: Calendar ==== */}
        <div className="md:col-span-2 bg-[#111]/80 border border-white/10 rounded-2xl p-6 shadow-lg shadow-indigo-900/10">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={({ date, view }) => {
              const formatted = format(date, "yyyy-MM-dd");
              if (notes.find((n) => n.date === formatted)) {
                return "react-calendar__tile--hasEvent";
              }
              return null;
            }}
            className="rounded-xl overflow-hidden text-black"
          />
          <style>{`
            .react-calendar {
              background: #1a1a1a;
              border: none;
              color: #f3f3f3;
              width: 100%;
              border-radius: 0.75rem;
            }
            .react-calendar__tile--hasEvent {
              background: linear-gradient(90deg, #80FFF9 0%, #CB52D4 100%);
              color: black !important;
              border-radius: 6px;
            }
            .react-calendar__navigation button {
              color: #80FFF9;
              font-weight: 600;
            }
            .react-calendar__month-view__days__day--weekend {
              color: #CB52D4;
            }
          `}</style>
        </div>

        {/* ==== RIGHT SIDE: Notes ==== */}
        <div className="bg-[#111]/80 border border-white/10 rounded-2xl p-6 shadow-lg shadow-indigo-900/10 flex flex-col">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <StickyNote className="text-[#CB52D4]" size={20} />
            Notes for {format(selectedDate, "MMM d, yyyy")}
          </h2>

          {/* Add new note */}
          <div className="flex flex-col gap-3 mb-4">
            <input
              type="time"
              value={newNote.time}
              onChange={(e) =>
                setNewNote({ ...newNote, time: e.target.value })
              }
              className="bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 text-gray-200 focus:border-[#80FFF9] outline-none"
            />
            <input
              type="text"
              placeholder="Write a short note..."
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
              className="bg-[#1a1a1a] border border-white/10 rounded-md px-4 py-2 text-gray-200 placeholder-gray-500 focus:border-[#80FFF9] outline-none"
            />
            <button
              onClick={addNote}
              className="flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 px-4 py-2 rounded-md hover:opacity-90 transition"
            >
              <Plus size={16} /> Add Note
            </button>
          </div>

          {/* Notes list */}
          <div className="space-y-3 overflow-y-auto max-h-[350px]">
            {dayNotes.length === 0 ? (
              <div className="text-gray-500 flex items-center gap-2">
                <XCircle size={16} /> No notes for this date
              </div>
            ) : (
              dayNotes.map((note) => (
                <div
                  key={note.id}
                  className="flex justify-between items-center bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-3 hover:bg-[#1a1a1a]/90 transition"
                >
                  <div>
                    <p className="font-medium text-[#80FFF9]">{note.time}</p>
                    <p className="text-gray-300 text-sm">{note.title}</p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-gray-500 hover:text-red-400 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;

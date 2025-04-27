import { useEffect, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import weekday from "dayjs/plugin/weekday";
import isToday from "dayjs/plugin/isToday";
import { supabase } from "../supabaseClient";

dayjs.extend(isoWeek);
dayjs.extend(weekday);
dayjs.extend(isToday);

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await supabase.from("pflanzen").select("*");
    const allEvents = [];

    data.forEach((plant) => {
      const { name, last_watered, water_interval, last_fertilized, fertilizer_interval } = plant;

      if (last_watered && water_interval) {
        const date = dayjs(last_watered).add(water_interval, "day").format("YYYY-MM-DD");
        allEvents.push({ date, label: `💧 ${name}` });
      }

      if (last_fertilized && fertilizer_interval) {
        const date = dayjs(last_fertilized).add(fertilizer_interval, "day").format("YYYY-MM-DD");
        allEvents.push({ date, label: `🧪 ${name}` });
      }
    });

    setEvents(allEvents);
  };

  const startOfMonth = currentDate.startOf("month").startOf("isoWeek");
  const endOfMonth = currentDate.endOf("month").endOf("isoWeek");
  const calendarDays = [];

  let day = startOfMonth;
  while (day.isBefore(endOfMonth)) {
    const formatted = day.format("YYYY-MM-DD");
    const dayEvents = events.filter((e) => e.date === formatted);

    calendarDays.push({
      date: day,
      isToday: day.isToday(),
      isCurrentMonth: day.month() === currentDate.month(),
      events: dayEvents,
    });

    day = day.add(1, "day");
  }

  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-center mb-4">📅 Pflegekalender</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-secondary" onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}>
          ←
        </button>
        <h4 className="mb-0">{currentDate.format("MMMM YYYY")}</h4>
        <button className="btn btn-outline-secondary" onClick={() => setCurrentDate(currentDate.add(1, "month"))}>
          →
        </button>
      </div>

      <div className="row fw-semibold text-center border-bottom pb-2">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((day, index) => (
          <div className="col" key={index}>
            {day}
          </div>
        ))}
      </div>

      {weeks.map((week, wIndex) => (
        <div className="row text-center" key={wIndex}>
          {week.map((d, dIndex) => (
            <div
              key={dIndex}
              className={`col p-2 border rounded m-1 ${
                !d.isCurrentMonth ? "text-muted bg-light" : ""
              } ${d.isToday ? "border-primary border-2" : ""}`}
              style={{ minHeight: "90px" }}
            >
              <div className="fw-bold">{d.date.date()}</div>
              <>
  {d.events.slice(0, 2).map((e, idx) => (
    <div key={idx} style={{ fontSize: "0.75rem" }}>{e.label}</div>
  ))}

  {d.events.length > 2 && (
    <div
      className="text-primary small mt-1"
      style={{ cursor: "pointer", textDecoration: "underline" }}
      onClick={() => alert(`Weitere Pflanzen:\n\n${d.events.slice(2).map(ev => ev.label).join("\n")}`)}
    >
      +{d.events.length - 2} weitere
    </div>
  )}
</>

            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

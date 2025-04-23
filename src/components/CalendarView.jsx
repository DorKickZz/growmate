import { useEffect, useState } from "react"
import Calendar from "react-calendar"
import 'react-calendar/dist/Calendar.css'
import { supabase } from "../supabaseClient"
import './CalendarCustom.css'

export default function CalendarView() {
  const [plants, setPlants] = useState([])
  const [value, setValue] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [duePlants, setDuePlants] = useState([])

  useEffect(() => {
    fetchPlants()
  }, [])

  const fetchPlants = async () => {
    const { data, error } = await supabase.from("pflanzen").select("*")
    if (!error) setPlants(data)
  }

  const getEventsForDate = (date) => {
    const events = []

    plants.forEach((plant) => {
      const watered = isDue(plant.last_watered, plant.water_interval, date)
      const fertilized = isDue(plant.last_fertilized, plant.fertilizer_interval, date)

      if (watered) {
        events.push({ type: "water", plant: plant.name })
      }
      if (fertilized) {
        events.push({ type: "fertilize", plant: plant.name })
      }
    })

    return events
  }

  const isDue = (last, interval, date) => {
    if (!last || !interval) return false
    const next = new Date(last)
    const check = new Date(date)
    next.setHours(0, 0, 0, 0)
    check.setHours(0, 0, 0, 0)

    while (next <= check) {
      if (next.getTime() === check.getTime()) return true
      next.setDate(next.getDate() + interval)
    }
    return false
  }

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null
    const events = getEventsForDate(date)

    return (
      <div className="d-flex justify-content-center gap-1 mt-1">
        {events.map((e, i) => (
          <div
            key={i}
            className={`calendar-marker ${e.type === 'water' ? 'bg-info' : 'bg-success'}`}
            title={`${e.type === 'water' ? '💧 Gießen' : '🌿 Düngen'}: ${e.plant}`}
          ></div>
        ))}
      </div>
    )
  }

  const handleDayClick = (date) => {
    setValue(date)
    setSelectedDate(date)

    const result = []

    plants.forEach((plant) => {
      if (isDue(plant.last_watered, plant.water_interval, date)) {
        result.push({ name: plant.name, type: "Gießen" })
      }
      if (isDue(plant.last_fertilized, plant.fertilizer_interval, date)) {
        result.push({ name: plant.name, type: "Düngen" })
      }
    })

    setDuePlants(result)
  }

  return (
    <div className="container mt-5">
      <h3>🗓️ Pflege-Kalender</h3>
      <Calendar
        onChange={handleDayClick}
        value={value}
        tileContent={tileContent}
      />

      {selectedDate && (
        <div className="mt-4">
          <h5>📅 Fällige Pflege am {selectedDate.toLocaleDateString()}:</h5>
          {duePlants.length === 0 ? (
            <p>✅ Keine Pflege nötig</p>
          ) : (
            <ul className="list-group">
              {duePlants.map((p, i) => (
                <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                  {p.name}
                  <span className={`badge ${p.type === 'Gießen' ? 'bg-info' : 'bg-success'}`}>
                    {p.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

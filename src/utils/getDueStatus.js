import dayjs from "dayjs"

export function getDueStatus(plant) {
  const today = dayjs()

  const wateringDue = plant.last_watered && plant.water_interval
    ? today.diff(dayjs(plant.last_watered), 'day') >= plant.water_interval
    : false

  const fertilizingDue = plant.last_fertilized && plant.fertilizer_interval
    ? today.diff(dayjs(plant.last_fertilized), 'day') >= plant.fertilizer_interval
    : false

  return {
    wateringDue,
    fertilizingDue,
  }
}

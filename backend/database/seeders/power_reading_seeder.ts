import { BaseSeeder } from '@adonisjs/lucid/seeders'
import PowerReading from '#models/power_reading'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    await PowerReading.query().delete()

    const now = DateTime.now()
    const totalCapacity = 3250 // sum of all zone capacities

    const readings = []
    for (let i = 11; i >= 0; i--) {
      const createdAt = now.minus({ hours: i * 2 })
      // Consumption varies between 60-90% of capacity
      const percentage = 60 + Math.random() * 30
      const totalConsumption = Math.round((percentage / 100) * totalCapacity * 100) / 100

      readings.push({
        totalConsumptionMw: totalConsumption,
        totalCapacityMw: totalCapacity,
        createdAt,
      })
    }

    await PowerReading.createMany(readings)

    console.log('Seeding completed: 12 power readings created')
  }
}

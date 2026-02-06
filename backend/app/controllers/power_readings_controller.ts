import type { HttpContext } from '@adonisjs/core/http'
import PowerReading from '#models/power_reading'
import { DateTime } from 'luxon'

export default class PowerReadingsController {
  async index({ request, response }: HttpContext) {
    const hours = Number(request.input('hours', 24))

    const since = DateTime.now().minus({ hours })

    const readings = await PowerReading.query()
      .where('created_at', '>=', since.toSQL()!)
      .orderBy('created_at', 'asc')

    return response.ok(readings)
  }
}

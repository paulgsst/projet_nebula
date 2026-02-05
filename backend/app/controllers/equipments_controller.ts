import type { HttpContext } from '@adonisjs/core/http'
import Equipment from '#models/equipment'

export default class EquipmentsController {
  /**
   * Liste tous les équipements
   */
  async index({ request, response }: HttpContext) {
    const zoneId = request.input('zone_id')

    const query = Equipment.query().preload('zone')

    if (zoneId) {
      query.where('zoneId', zoneId)
    }

    const equipments = await query
    return response.ok(equipments)
  }

  /**
   * Récupère un équipement par son ID
   */
  async show({ params, response }: HttpContext) {
    const equipment = await Equipment.query()
      .where('id', params.id)
      .preload('zone')
      .first()

    if (!equipment) {
      return response.notFound({ message: 'Equipment not found' })
    }

    return response.ok(equipment)
  }
}

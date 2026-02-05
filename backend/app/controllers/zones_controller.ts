import type { HttpContext } from '@adonisjs/core/http'
import Zone from '#models/zone'

export default class ZonesController {
  /**
   * Liste toutes les zones
   */
  async index({ response }: HttpContext) {
    const zones = await Zone.query().preload('equipments')
    return response.ok(zones)
  }

  /**
   * Récupère une zone par son ID
   */
  async show({ params, response }: HttpContext) {
    const zone = await Zone.query()
      .where('id', params.id)
      .preload('equipments')
      .first()

    if (!zone) {
      return response.notFound({ message: 'Zone not found' })
    }

    return response.ok(zone)
  }
}

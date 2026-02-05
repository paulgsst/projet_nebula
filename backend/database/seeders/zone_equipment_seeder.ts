import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Zone from '#models/zone'
import Equipment from '#models/equipment'

export default class extends BaseSeeder {
  async run() {
    // Vérifier si les données existent déjà
    const existingZones = await Zone.query().count('* as total')
    if (Number(existingZones[0].$extras.total) > 0) {
      console.log('Seeding skipped: data already exists')
      return
    }

    // Créer les zones
    const zones = await Zone.createMany([
      { name: 'Zone Nord', capacityMaxMw: 500 },
      { name: 'Zone Sud', capacityMaxMw: 750 },
      { name: 'Zone Est', capacityMaxMw: 400 },
      { name: 'Zone Ouest', capacityMaxMw: 600 },
      { name: 'Zone Centrale', capacityMaxMw: 1000 },
    ])

    // Équipements pour chaque zone
    const equipmentsData = [
      // Zone Nord
      { name: 'Turbine Nord-1', zoneId: zones[0].id, type: 'turbine', capacityMaxMw: 150, importanceWeight: 3 },
      { name: 'Turbine Nord-2', zoneId: zones[0].id, type: 'turbine', capacityMaxMw: 150, importanceWeight: 3 },
      { name: 'Transformateur Nord-1', zoneId: zones[0].id, type: 'transformateur', capacityMaxMw: 200, importanceWeight: 2 },
      { name: 'Générateur Nord-1', zoneId: zones[0].id, type: 'generateur', capacityMaxMw: 100, importanceWeight: 2 },

      // Zone Sud
      { name: 'Turbine Sud-1', zoneId: zones[1].id, type: 'turbine', capacityMaxMw: 200, importanceWeight: 3 },
      { name: 'Turbine Sud-2', zoneId: zones[1].id, type: 'turbine', capacityMaxMw: 200, importanceWeight: 3 },
      { name: 'Transformateur Sud-1', zoneId: zones[1].id, type: 'transformateur', capacityMaxMw: 250, importanceWeight: 2 },
      { name: 'Compresseur Sud-1', zoneId: zones[1].id, type: 'compresseur', capacityMaxMw: 50, importanceWeight: 1 },
      { name: 'Pompe Sud-1', zoneId: zones[1].id, type: 'pompe', capacityMaxMw: 30, importanceWeight: 1 },

      // Zone Est
      { name: 'Turbine Est-1', zoneId: zones[2].id, type: 'turbine', capacityMaxMw: 120, importanceWeight: 3 },
      { name: 'Transformateur Est-1', zoneId: zones[2].id, type: 'transformateur', capacityMaxMw: 150, importanceWeight: 2 },
      { name: 'Générateur Est-1', zoneId: zones[2].id, type: 'generateur', capacityMaxMw: 80, importanceWeight: 2 },
      { name: 'Condenseur Est-1', zoneId: zones[2].id, type: 'condenseur', capacityMaxMw: 40, importanceWeight: 1 },

      // Zone Ouest
      { name: 'Turbine Ouest-1', zoneId: zones[3].id, type: 'turbine', capacityMaxMw: 180, importanceWeight: 3 },
      { name: 'Turbine Ouest-2', zoneId: zones[3].id, type: 'turbine', capacityMaxMw: 180, importanceWeight: 3 },
      { name: 'Transformateur Ouest-1', zoneId: zones[3].id, type: 'transformateur', capacityMaxMw: 200, importanceWeight: 2 },
      { name: 'Pompe Ouest-1', zoneId: zones[3].id, type: 'pompe', capacityMaxMw: 25, importanceWeight: 1 },

      // Zone Centrale
      { name: 'Turbine Centrale-1', zoneId: zones[4].id, type: 'turbine', capacityMaxMw: 300, importanceWeight: 3 },
      { name: 'Turbine Centrale-2', zoneId: zones[4].id, type: 'turbine', capacityMaxMw: 300, importanceWeight: 3 },
      { name: 'Transformateur Centrale-1', zoneId: zones[4].id, type: 'transformateur', capacityMaxMw: 400, importanceWeight: 2 },
      { name: 'Transformateur Centrale-2', zoneId: zones[4].id, type: 'transformateur', capacityMaxMw: 400, importanceWeight: 2 },
      { name: 'Générateur Centrale-1', zoneId: zones[4].id, type: 'generateur', capacityMaxMw: 200, importanceWeight: 3 },
      { name: 'Compresseur Centrale-1', zoneId: zones[4].id, type: 'compresseur', capacityMaxMw: 80, importanceWeight: 1 },
    ]

    await Equipment.createMany(equipmentsData)

    console.log('Seeding completed: 5 zones and 24 equipments created')
  }
}

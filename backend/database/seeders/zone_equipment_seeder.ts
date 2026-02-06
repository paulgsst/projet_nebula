import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Zone from '#models/zone'
import Equipment from '#models/equipment'

export default class extends BaseSeeder {
  async run() {
    // Supprimer les anciennes données pour re-seed proprement
    await Equipment.query().delete()
    await Zone.query().delete()

    // Créer les zones
    const zones = await Zone.createMany([
      { name: 'Zone Nord', capacityMaxMw: 500 },
      { name: 'Zone Sud', capacityMaxMw: 750 },
      { name: 'Zone Est', capacityMaxMw: 400 },
      { name: 'Zone Ouest', capacityMaxMw: 600 },
      { name: 'Zone Centrale', capacityMaxMw: 1000 },
    ])

    // Équipements pour chaque zone avec currentConsumptionMw
    const equipmentsData = [
      // Zone Nord (total capacity 500 MW)
      { name: 'Turbine Nord-1', zoneId: zones[0].id, type: 'turbine', capacityMaxMw: 150, importanceWeight: 3, currentConsumptionMw: 112 },
      { name: 'Turbine Nord-2', zoneId: zones[0].id, type: 'turbine', capacityMaxMw: 150, importanceWeight: 3, currentConsumptionMw: 98 },
      { name: 'Transformateur Nord-1', zoneId: zones[0].id, type: 'transformateur', capacityMaxMw: 200, importanceWeight: 2, currentConsumptionMw: 145 },
      { name: 'Générateur Nord-1', zoneId: zones[0].id, type: 'generateur', capacityMaxMw: 100, importanceWeight: 2, currentConsumptionMw: 67 },

      // Zone Sud (total capacity 750 MW)
      { name: 'Turbine Sud-1', zoneId: zones[1].id, type: 'turbine', capacityMaxMw: 200, importanceWeight: 3, currentConsumptionMw: 165 },
      { name: 'Turbine Sud-2', zoneId: zones[1].id, type: 'turbine', capacityMaxMw: 200, importanceWeight: 3, currentConsumptionMw: 142 },
      { name: 'Transformateur Sud-1', zoneId: zones[1].id, type: 'transformateur', capacityMaxMw: 250, importanceWeight: 2, currentConsumptionMw: 180 },
      { name: 'Compresseur Sud-1', zoneId: zones[1].id, type: 'compresseur', capacityMaxMw: 50, importanceWeight: 1, currentConsumptionMw: 32 },
      { name: 'Pompe Sud-1', zoneId: zones[1].id, type: 'pompe', capacityMaxMw: 30, importanceWeight: 1, currentConsumptionMw: 18 },

      // Zone Est (total capacity 400 MW)
      { name: 'Turbine Est-1', zoneId: zones[2].id, type: 'turbine', capacityMaxMw: 120, importanceWeight: 3, currentConsumptionMw: 85 },
      { name: 'Transformateur Est-1', zoneId: zones[2].id, type: 'transformateur', capacityMaxMw: 150, importanceWeight: 2, currentConsumptionMw: 110 },
      { name: 'Générateur Est-1', zoneId: zones[2].id, type: 'generateur', capacityMaxMw: 80, importanceWeight: 2, currentConsumptionMw: 55 },
      { name: 'Condenseur Est-1', zoneId: zones[2].id, type: 'condenseur', capacityMaxMw: 40, importanceWeight: 1, currentConsumptionMw: 28 },

      // Zone Ouest (total capacity 600 MW)
      { name: 'Turbine Ouest-1', zoneId: zones[3].id, type: 'turbine', capacityMaxMw: 180, importanceWeight: 3, currentConsumptionMw: 130 },
      { name: 'Turbine Ouest-2', zoneId: zones[3].id, type: 'turbine', capacityMaxMw: 180, importanceWeight: 3, currentConsumptionMw: 155 },
      { name: 'Transformateur Ouest-1', zoneId: zones[3].id, type: 'transformateur', capacityMaxMw: 200, importanceWeight: 2, currentConsumptionMw: 140 },
      { name: 'Pompe Ouest-1', zoneId: zones[3].id, type: 'pompe', capacityMaxMw: 25, importanceWeight: 1, currentConsumptionMw: 15 },

      // Zone Centrale (total capacity 1000 MW)
      { name: 'Turbine Centrale-1', zoneId: zones[4].id, type: 'turbine', capacityMaxMw: 300, importanceWeight: 3, currentConsumptionMw: 240 },
      { name: 'Turbine Centrale-2', zoneId: zones[4].id, type: 'turbine', capacityMaxMw: 300, importanceWeight: 3, currentConsumptionMw: 210 },
      { name: 'Transformateur Centrale-1', zoneId: zones[4].id, type: 'transformateur', capacityMaxMw: 400, importanceWeight: 2, currentConsumptionMw: 290 },
      { name: 'Transformateur Centrale-2', zoneId: zones[4].id, type: 'transformateur', capacityMaxMw: 400, importanceWeight: 2, currentConsumptionMw: 310 },
      { name: 'Générateur Centrale-1', zoneId: zones[4].id, type: 'generateur', capacityMaxMw: 200, importanceWeight: 3, currentConsumptionMw: 150 },
      { name: 'Compresseur Centrale-1', zoneId: zones[4].id, type: 'compresseur', capacityMaxMw: 80, importanceWeight: 1, currentConsumptionMw: 45 },
    ]

    await Equipment.createMany(equipmentsData)

    console.log('Seeding completed: 5 zones and 24 equipments created')
  }
}

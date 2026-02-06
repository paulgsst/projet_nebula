/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const ZonesController = () => import('#controllers/zones_controller')
const EquipmentsController = () => import('#controllers/equipments_controller')
const PowerReadingsController = () => import('#controllers/power_readings_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Zones
router.get('/zones', [ZonesController, 'index'])
router.get('/zones/:id', [ZonesController, 'show'])

// Equipments
router.get('/equipments', [EquipmentsController, 'index'])
router.get('/equipments/:id', [EquipmentsController, 'show'])

// Power Readings
router.get('/power-readings', [PowerReadingsController, 'index'])

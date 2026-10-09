import express from 'express'
import { FORECAST_DATA } from '../data/mockData.js'

const router = express.Router()

// GET /api/forecast
router.get('/', (req, res) => {
  try {
    const { occupation_id, district_id, horizon = '4Q' } = req.query
    const quarters = horizon === '2Q' ? 2 : horizon === '8Q' ? 8 : 4
    
    const data = FORECAST_DATA.map(d => ({
      ...d,
      occupation_id: occupation_id || 'aggregate',
      district_id: district_id || 'national',
    })).slice(0, 8 + quarters)

    const forecastPeriods = data.filter(d => d.is_forecast)
    const latestForecast = forecastPeriods[forecastPeriods.length - 1]

    res.json({
      success: true,
      metadata: {
        model: 'Ensemble (ARIMA + XGBoost + ETS + Hierarchical)',
        mape_backtest: 6.1,
        rmse: 312,
        interval_coverage: 83.4,
        confidence_level: 80,
      },
      summary: {
        forecast_demand_12m: latestForecast?.demand || null,
        forecast_supply_12m: latestForecast?.supply || null,
        forecast_gap_12m: latestForecast ? latestForecast.demand - latestForecast.supply : null,
      },
      data,
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

export default router

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const POKEDEX = require('./pokedex.json')

const app = express()

// start of pipeline: all requests go through these
app.use(morgan('dev'))
// app.use(cors())   // allow cross-origin
// app.use(helmet()) // be careful with your response headers

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  debugger
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    console.log("unauthorized request: api token check failed")
    return res.status(401).json({ error: 'Unauthorized request' })
    }
   next() // go to the next handler (may be endpoint-specific)
 })




 // pipeline: specific endpoints

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]
app.get('/types', function handleGetTypes(req, res) {
  res.json(validTypes)
});

app.get('/pokemon', function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon;

  // filter our pokemon by name if name query param is present
  if (req.query.name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }

  // filter our pokemon by type if type query param is present
  if (req.query.type) {
    response = response.filter(pokemon =>
      pokemon.type.includes(req.query.type)
    )
  }

  res.json(response)
})


const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})

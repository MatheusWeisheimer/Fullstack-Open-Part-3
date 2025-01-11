const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

let persons = require('./persons.json')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan((tokens, req, res) => {
    morgan.token('data', (request, response) => JSON.stringify(request.body))
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['data'](req, res)
    ].join(' ')
}))

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date.toString()}</p>
    `)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const newName = request.body.name
    const newNumber = request.body.number
    const newId = String(Math.floor(Math.random() * 1000000000))

    if (!newName || !newNumber) {
        return response.status(400).json({
            "error": "content missing"
        })
    } else if (persons.find(p => p.name === newName)) {
        return response.status(400).json({
            "error": "name must be unique"
        })
    }

    const newPerson = {
        "id": newId,
        "name": request.body.name,
        "number": request.body.number
    }
    
    persons = [...persons, newPerson]
    response.json(newPerson)
}) 

app.get('/api/persons/:id', (request, response) => {
    const person = persons.find(p => p.id === request.params.id)

    if (person) {   
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    persons = persons.filter(p => p.id !== request.params.id)
    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
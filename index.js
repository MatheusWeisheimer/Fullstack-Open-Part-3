const express = require('express')
let persons = require('./persons.json')

const app = express()
app.use(express.json())

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
    const newId = String(Math.floor(Math.random() * 1000000000))
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
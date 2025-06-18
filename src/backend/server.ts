import express from "express"
import http from "http"
import cors from 'cors'
import path from 'path'

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, '../..', 'public')))

server.listen(3000, ()=> {  
  console.clear()
  console.log('rodando na porta 3000');
})   
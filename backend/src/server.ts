import { Prisma, PrismaClient } from '@prisma/client'
import express , {Express, Request, Response} from 'express'

const prisma = new PrismaClient()
const app = express()

app.get("/texts", async (req : Request, res : Response) => {
    let texts = await prisma.all_texts.findMany()
})
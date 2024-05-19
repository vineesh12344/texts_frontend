import { Prisma, PrismaClient } from '@prisma/client'
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import _ from 'lodash';

const prisma = new PrismaClient()
prisma.$use(async (params: Prisma.MiddlewareParams, next: (params: Prisma.MiddlewareParams) => Promise<any>) => {
    if (params.args?.cursor) {
        const key = params.model as Prisma.ModelName;
        const result = await (prisma[key] as any).findUniqueOrThrow({
            where: params.args.cursor,
            select: params.args.orderBy ? _(params.args.orderBy).mapValues(x => true).value() : undefined,
        });
        params.args.where = {
            ...params.args.where,
            ..._(params.args.cursor).mapValues((x, k) => ({
                [x === 'desc' ? 'lte' : 'gte']: result[k],
            })).value(),
            ..._(params.args.orderBy).mapValues((x, k) => ({
                [x === 'desc' ? 'lte' : 'gte']: result[k],
            })).value(),
        };
        delete params.args.cursor;
    }
    return await next(params);
});

const app: Express = express()
app.use(cors())
const port = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/texts", async (req: Request, res: Response) => {
    let texts;

    let dayChunks = await prisma.today_chunk.findMany({
        take: 1,
        orderBy: {
            date: 'desc'
        }
    })
    let take = parseInt(dayChunks[0].take?.toString() ?? '15')
    let cursor = dayChunks[0].text_id
    texts = await prisma.all_texts.findMany({
        take: take,
        skip: 1,
        cursor: {
            id: cursor
        },
        orderBy: {
            order: 'asc'
        }
    })
    let processed_texts = await Promise.all(texts.map(async (text) => ({
        ...text,
        text_body : await handleJson(text.text_body),
        order: text.order?.toString() ?? ''
    })))
    return res.status(200).json(processed_texts)
})

async function handleJson(text_body : string) {
    let parsedText;
    try {
        parsedText = JSON.parse(text_body);
    } catch (e) {
        return text_body;
    }
    return parsedText[0]["text"];
}

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
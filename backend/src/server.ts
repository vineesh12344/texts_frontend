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

app.get("/texts", async (req: Request, res: Response) => {
    let take = Number(req.query.take) || 10
    let texts;
    if (req.query.cursor === undefined) {
        texts = await prisma.all_texts.findMany({
            take: take,
            skip: 1,
            orderBy: {
                order: 'asc'
            }
        })
    } else {
        let cursor;
        try {
            cursor = String(req.query.cursor)
        } catch {
            return res.status(400).json({ error: 'Invalid cursor' })
        }
        texts = await prisma.all_texts.findMany({
            take: take,
            skip: 1,
            cursor : {
                id : cursor
            },
            orderBy: {
                order: 'asc'
            }
        })
    }
    let processed_texts = texts.map((text) => ({
        ...text,
        order: text.order?.toString() ?? ''
    }))
    return res.status(200).json(processed_texts)
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
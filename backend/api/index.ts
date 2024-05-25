import { Prisma, PrismaClient } from '@prisma/client';
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

interface AuthenticatedRequest extends Request {
    decodedToken?: any;
}

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

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not set')
}

var login = async (req: AuthenticatedRequest, res: Response, next : NextFunction) => {
    console.log('Login middleware')
    const authHeader = req.headers.authorization;
    if (authHeader === null || authHeader === undefined || !authHeader.startsWith("Bearer ")) {
        console.log("Wrong format")
        res.status(401).send();
        return;
    }
    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }, (error, decodedToken) => {
        if (error) {
            console.log("Decoding failed")
            res.status(401).send();
            return;
        }
        req.decodedToken = decodedToken;
        next();
    });
};

const app: Express = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/texts",login, async (req: Request, res: Response) => {
    console.log('Request received')
    res.setHeader('Access-Control-Allow-Credentials', "true")
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
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

app.post("/login", async (req: Request, res: Response) => {
    let { username, password } = req.body;
    let user = await prisma.users.findUnique({
        where: {
            username: username,
            password: password
        }
    })

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const payload = { username: user.username, id: user.id }
    jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
        if (err) {
            return res.status(500).json({ message: "Internal server error" })
        }
        return res.status(200).json({ token })
    })
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

app.listen(3001, () => console.log('Server ready on port 3001.'));
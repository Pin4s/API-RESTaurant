import { Request, Response, NextFunction } from "express"
import { z } from 'zod'
import { knex } from "@/database/knex"
import { AppError } from "@/utils/AppError"


class TablesSessionController {

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                table_id: z.number(),
            })

            const { table_id } = bodySchema.parse(req.body)

            const sessions = await knex<TablesSessionRepository>("tables_session")
                .where({ table_id })
                .orderBy('opened_at')
                .first()

            if (sessions && !sessions.closed_at) {
                throw new AppError('this tables session already exists')
            }


            await knex<TablesSessionRepository>("tables_session").insert({
                table_id,
                opened_at: knex.fn.now()
            })

            return res.status(201).json({ message: 'mesa abrida' })
        } catch (error) {
            next(error)
        }
    }

    async index(req: Request, res:Response, next:NextFunction){
       try {
        const sessions = await knex<TablesSessionRepository>("tables_session").orderBy('closed_at')

        return res.json(sessions)
       } catch (error) {
        next(error)
       }
    }

    async update(req: Request, res:Response, next:NextFunction){
        try {
            const id = z
            .string()
            .transform((value) => Number(value))
            .refine((value) => !isNaN(value), {message: 'id must be a number'})
            .parse(req.params.id)


            const session = await knex<TablesSessionRepository>("tables_session").where({id}).first()

            if(!session){
                throw new AppError("Sessions doesn't exist")
            }
            if(session.closed_at){
                throw new AppError("Sessions has already been closed")
            }

            await knex<TablesSessionRepository>("tables_session").update({closed_at: knex.fn.now()}).where({id})

            return res.json(id)

        } catch (error) {
            next(error)
        }
    }
}

export { TablesSessionController }
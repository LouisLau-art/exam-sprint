export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const method = event.method

    if (method === 'GET') {
        const goal: any = db.prepare('SELECT * FROM goals WHERE id = ?').get(id)
        if (!goal) {
            throw createError({ statusCode: 404, message: 'Goal not found' })
        }
        return {
            id: goal.id,
            title: goal.title,
            description: goal.description,
            deadline: goal.deadline,
            type: goal.type,
            target: goal.target,
            current: goal.current,
            unit: goal.unit,
            createdAt: goal.created_at,
            updatedAt: goal.updated_at,
        }
    }

    if (method === 'PUT') {
        const body = await readBody(event)

        db.prepare(`
      UPDATE goals SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        deadline = ?,
        type = COALESCE(?, type),
        target = COALESCE(?, target),
        current = COALESCE(?, current),
        unit = COALESCE(?, unit),
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
            body.title,
            body.description,
            body.deadline,
            body.type,
            body.target,
            body.current,
            body.unit,
            id
        )

        return { success: true }
    }

    if (method === 'DELETE') {
        db.prepare('DELETE FROM goals WHERE id = ?').run(id)
        return { success: true }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' })
})

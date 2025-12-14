export default defineEventHandler(async (event) => {
    const method = event.method

    if (method === 'GET') {
        const goals = db.prepare('SELECT * FROM goals ORDER BY created_at DESC').all()
        return goals.map((goal: any) => ({
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
        }))
    }

    if (method === 'POST') {
        const body = await readBody(event)
        const id = crypto.randomUUID()

        db.prepare(`
      INSERT INTO goals (id, title, description, deadline, type, target, current, unit)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            id,
            body.title,
            body.description || '',
            body.deadline || null,
            body.type || 'task-driven',
            body.target || 10,
            body.current || 0,
            body.unit || '任务'
        )

        return { id, ...body }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' })
})

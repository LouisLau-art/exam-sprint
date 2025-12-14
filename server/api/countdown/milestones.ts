export default defineEventHandler(async (event) => {
    const method = event.method

    if (method === 'GET') {
        const milestones = db.prepare('SELECT * FROM milestones ORDER BY date ASC').all()
        return milestones.map((m: any) => ({
            id: m.id,
            name: m.name,
            date: m.date,
            color: m.color,
        }))
    }

    if (method === 'POST') {
        const body = await readBody(event)
        const id = crypto.randomUUID()
        const colors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
        const color = colors[Math.floor(Math.random() * colors.length)]

        db.prepare(`
      INSERT INTO milestones (id, name, date, color)
      VALUES (?, ?, ?, ?)
    `).run(id, body.name, body.date, color)

        return { id, name: body.name, date: body.date, color }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' })
})

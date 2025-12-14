export default defineEventHandler(async (event) => {
    const method = event.method

    if (method === 'GET') {
        const sessions = db.prepare('SELECT * FROM pomodoro_sessions ORDER BY completed_at DESC').all()
        return sessions.map((session: any) => ({
            id: session.id,
            type: session.type,
            duration: session.duration,
            taskId: session.task_id,
            note: session.note,
            startedAt: session.started_at,
            completedAt: session.completed_at,
        }))
    }

    if (method === 'POST') {
        const body = await readBody(event)
        const id = crypto.randomUUID()

        db.prepare(`
      INSERT INTO pomodoro_sessions (id, type, duration, task_id, note, started_at, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
            id,
            body.type,
            body.duration,
            body.taskId || null,
            body.note || '',
            body.startedAt,
            body.completedAt
        )

        return { id, ...body }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' })
})

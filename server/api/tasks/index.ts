export default defineEventHandler(async (event) => {
    const method = event.method

    if (method === 'GET') {
        const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all()
        return tasks.map((task: any) => ({
            id: task.id,
            title: task.title,
            notes: task.notes,
            dueDate: task.due_date,
            priority: task.priority,
            estimatedPomodoros: task.estimated_pomodoros,
            tags: JSON.parse(task.tags || '[]'),
            goalId: task.goal_id,
            completed: Boolean(task.completed),
            createdAt: task.created_at,
            updatedAt: task.updated_at,
        }))
    }

    if (method === 'POST') {
        const body = await readBody(event)
        const id = crypto.randomUUID()

        db.prepare(`
      INSERT INTO tasks (id, title, notes, due_date, priority, estimated_pomodoros, tags, goal_id, completed)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
            id,
            body.title,
            body.notes || '',
            body.dueDate || null,
            body.priority || 'P1',
            body.estimatedPomodoros || 1,
            JSON.stringify(body.tags || []),
            body.goalId || null,
            body.completed ? 1 : 0
        )

        return { id, ...body }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' })
})

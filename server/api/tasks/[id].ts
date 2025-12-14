export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const method = event.method

    if (method === 'GET') {
        const task: any = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id)
        if (!task) {
            throw createError({ statusCode: 404, message: 'Task not found' })
        }
        return {
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
        }
    }

    if (method === 'PUT') {
        const body = await readBody(event)

        db.prepare(`
      UPDATE tasks SET
        title = COALESCE(?, title),
        notes = COALESCE(?, notes),
        due_date = ?,
        priority = COALESCE(?, priority),
        estimated_pomodoros = COALESCE(?, estimated_pomodoros),
        tags = COALESCE(?, tags),
        goal_id = ?,
        completed = COALESCE(?, completed),
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
            body.title,
            body.notes,
            body.dueDate,
            body.priority,
            body.estimatedPomodoros,
            body.tags ? JSON.stringify(body.tags) : null,
            body.goalId,
            body.completed !== undefined ? (body.completed ? 1 : 0) : null,
            id
        )

        return { success: true }
    }

    if (method === 'DELETE') {
        db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
        return { success: true }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' })
})

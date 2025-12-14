export default defineEventHandler(async (event) => {
    const method = event.method

    if (method === 'GET') {
        const countdown: any = db.prepare('SELECT * FROM countdown WHERE id = 1').get()
        const milestones = db.prepare('SELECT * FROM milestones ORDER BY date ASC').all()

        return {
            examName: countdown?.exam_name || null,
            examDate: countdown?.exam_date || null,
            milestones: milestones.map((m: any) => ({
                id: m.id,
                name: m.name,
                date: m.date,
                color: m.color,
            })),
        }
    }

    if (method === 'PUT') {
        const body = await readBody(event)

        db.prepare(`
      UPDATE countdown SET
        exam_name = ?,
        exam_date = ?
      WHERE id = 1
    `).run(body.examName, body.examDate)

        return { success: true }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' })
})

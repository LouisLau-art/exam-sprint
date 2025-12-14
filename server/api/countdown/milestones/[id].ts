export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id')
    const method = event.method

    if (method === 'DELETE') {
        db.prepare('DELETE FROM milestones WHERE id = ?').run(id)
        return { success: true }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' })
})

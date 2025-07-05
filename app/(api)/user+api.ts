import { neon } from "@neondatabase/serverless";

export const POST = async (request : Request) => {
    
    console.log(process.env.DATABASE_URL)

    try {
        if (!process.env.DATABASE_URL) { throw new Error('DATABASE_URL is not defined.') }
        const sql = neon(process.env.DATABASE_URL)
        const { name, email, clerkId } = await request.json()
    

        if (!name || !email || !clerkId) {
            return Response.json(
                { error : "Missing required fields." },
                { status : 400 }
            )}

        const response = await sql`
            INSERT INTO users (name, email, clerk_id) 
            VALUES (${name}, ${email}, ${clerkId})
            `

        return Response.json(
            { message : "User has been created."},
            { status : 201 }
        )

    } catch (err) {
        console.log(err)
        return Response.json( { error : err || "Unknown error" }, { status : 500 }, )
    }
}
import pool from "../db/db.js"

export const createOrganizationService = async(userId: number, name:string)=>{

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const inviteCode = Math.random()
                           .toString(36).substring(2,8).toUpperCase();

        const orgsResult =await client.query(
            `
            INSERT INTO organizations (
            name, 
            invite_code,
            created_by
            )
            VALUES ($1, $2,$3)
            RETURNING *
            `,[name ,inviteCode ,userId]
        );

        const organization = orgsResult.rows[0];

        await client.query(
            `INSERT INTO organization_members (
            organization_id,
            user_id,
            role
            )
            VALUES($1, $2, 'admin') 
            `,
            [organization.id, userId]
        );

        await client.query("COMMIT")

        return organization;
        
        
    } catch (error) {

        await client.query("ROLLBACK")

        throw error
        
    } finally{
        client.release();
    }

}
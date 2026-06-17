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

export const joinOrganizationService = async( userId: number, inviteCode:string)=>{

    const orgsResult = await pool.query(
        `
        SELECT * FROM organization WHERE invite_code  = $1
        `, [inviteCode]
    )

    const organization  = orgsResult.rows[0]

    if(!organization){
        throw new Error("Organziation not found");

    }

    const existingMember  = await pool.query(
        `
        SELECT * FROM organization_members WHERE organization_id = $1 AND user_id = $2
        `,[organization.id , userId]
    );

    if(existingMember.rows.length > 0){
        throw new Error("already joinded ")
    }

    await pool.query(
        `
        INSERT INTO organization_members (
            organization_id,
            user_id,
            role
            )
            VALUES ($1 , $2 , 'memeber')
            `, [organization.id , userId]
        
        
    );

    return organization
        
    
}

export const getMyOrganizationService = async(userId:number)=>{
    const result = await pool.query(
        `
        SELECT o.id, o.name , o.invite_code ,om.role FROM organization o JOIN organization_member om ON o.id = om.organization_id
        WHERE om.user_id =$1
        
        `,[userId]
    );

    return result.rows;
}

export const getOrganizationMembersService =
async (organizationId: number) => {

    const result = await pool.query(
        `
        SELECT
            u.id,
            u.name,
            u.email,
            om.role
        FROM users u
        JOIN organization_members om
            ON u.id = om.user_id
        WHERE om.organization_id = $1
        `,
        [organizationId]
    );

    return result.rows;
};
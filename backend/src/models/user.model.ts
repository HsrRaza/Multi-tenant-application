import pool from "../db/db.ts";

export const getAllUsersService = async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows
}

export const getUserByIdService = async (id: number) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
}
export const signUpService = async (
    name: string, email: string, password_hash: string, role: string = "user", organizationName: string
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const orgResult = await client.query(
            `
            INSERT INTO organizations (name) VALUES ($1) RETURNING id , name 
            `, [organizationName]
        );

        const organizationId = orgResult.rows[0].id;

        // Hash passoword ;

        const HashPasssword = await bcrypt.hash(password_hash, 10);

        // create admin user for the organization;

        const userResult = await client.query(
            `
            INSERT INTO users (organization_id, name, email, password_hash, role) VALUES ($1, $2, $3, $4 , $5) RETURNING  * 
            `, [organizationId, name, email, HashPasssword, "admin",]
        );

        await client.query("COMMIT");

        return {
            organization: orgResult.rows[0],
            user: userResult.rows[0]
        };

    } catch (error) {
        await client.query("ROLLBACK")
        throw error
    } finally {
        client.release()
    }

}
export const updateUserService = async (id: number, name: string, email: string) => {
    const result = await pool.query("UPDATE users SET name = $1, email=$2 WHERE id = $3 RETURNING *", [name, email, id]);
    return result.rows[0];
}
export const deleteUserService = async (id: number) => {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return result.rows[0];
}
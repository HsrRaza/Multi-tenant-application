import pool from "../db/db.ts";
import bcrypt from "bcrypt"

export const getAllUsersService = async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows
}

export const getUserByIdService = async (id: number) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
}



export const signUpService = async (
    name: string,
    email: string,
    password_hash: string,
) => {

    try {
        const hashPassword = bcrypt.hash(password_hash, 10)
        
        const result = await pool.query("INSERT INTO users (name , email , password_hash , role) VALUES($1, $2, $3)", [name, email, hashPassword])

        return result.rows[0]
        
    } catch (error) {
         console.error(error)
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
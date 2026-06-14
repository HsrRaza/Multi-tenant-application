import pool from "../db/db.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

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
        const hashPassword = await bcrypt.hash(password_hash, 10)

        const result = await pool.query("INSERT INTO users (name , email , password_hash) VALUES($1, $2, $3) RETURNING *", [name, email, hashPassword])

        console.log(result.rows);

        return result.rows[0]



    } catch (error) {
        console.error(error)
        throw error
    }


}
export const loginService = async (email: string, password: string) => {
    //  find user 
    const result = await pool.query(
        ` SELECT * FROM users  WHERE email = &1`, [email]
    );
    const user = result.rows[0];

    if (!user) {
        throw new Error("Invalid email or password")
    }
    // compare passsword

    const isMatch = await bcrypt.compare(
        password,
        user.password_hash
    )

    if (!isMatch) {
        throw new Error("Invalid email or password")
    }

    // membership role and user check

    const memberShipResult = await pool.query(
        `
        SELECT organizaton_id , role FROM 
        organization_members
        WHERE user_id = $1
         `, [user.id]
    );


    // Accesstoken 

    const accessToken = jwt.sign(
        {
            userId: user.id
        }, process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "15m"
        }
    )

    const refreshToken = jwt.sign(
        {
            userId: user.id
        },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "7d"
        }
    )

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        accessToken,
        refreshToken
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
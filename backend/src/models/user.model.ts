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
        ` SELECT * FROM users  WHERE email = $1`, [email]
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
        SELECT organization_id , role FROM 
        organization_members
        WHERE user_id = $1
         `, [user.id]
    );


    return {
        user,
        membership:memberShipResult.rows[0] || null
    }
}

export const updateRefreshTokenService = async (
    userId: number,
    refreshToken: string | null
) => {
    await pool.query(
        "UPDATE users SET refreshtoken = $1 WHERE id = $2",
        [refreshToken, userId]
    );
};

export const logoutService = async (
    userId:number,
    refreshToken: string
) => {

    await pool.query(
        `
        UPDATE users
        SET refreshtoken = NULL
        WHERE id = $1
        and refreshtoken = $2
        `,
        [userId , refreshToken]
    );

    return true;
};


export const refreshTokenService = async (
    refreshToken: string
) => {

    const tokenResult = await pool.query(
        `
        SELECT id
        FROM users
        WHERE refreshtoken = $1
        `,
        [refreshToken]
    );

    if (!tokenResult.rows.length) {
        throw new Error(
            "Invalid refresh token"
        );
    }

    const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
    ) as any;

    return decoded.payload || decoded;
};
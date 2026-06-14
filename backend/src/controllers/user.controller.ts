import { signUpService, deleteUserService, getAllUsersService, getUserByIdService, updateUserService, loginService } from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

// standalised response 
const handleResponse = <T>(res: any, status: number, message: string, data: T) => {
    res.status(status).json({
        status,
        message,
        data
    })
}
export const signUp = async (req: any, res: any, next: any) => {

    const { name, email, password_hash } = req.body;
    try {
        const newUser = await signUpService(name, email, password_hash);

        console.log(newUser);

        handleResponse(res, 201, "user created successfully", newUser)

    } catch (err) {
        next(err);
    }
}

export const login = async (req: any, res: any) => {
    const { email, password } = req.body

    const auth = await loginService(email, password)

    const accessToken = generateAccessToken({
        userId: auth.user.id,
        email: auth.user.email,
        organizationId: auth.membership?.organization_id,
        role: auth.membership?.role

    });

    const refreshToken = generateRefreshToken({
        userId: auth.user.id
    });

    handleResponse(
        res, 
        200,
        "Login SuccessFully ",
        {
            user:{
                id:auth.user.id,
                name:auth.user.name,
                emai:auth.user.email
            },

            accessToken,
            refreshToken
        }
    );
}

export const getAllUsers = async (req: any, res: any, next: any) => {
    try {
        const users: any = await getAllUsersService();
        handleResponse(res, 200, "users retrieved successfully", users)
    } catch (err) {
        next(err);
    }
}


export const getUserById = async (req: any, res: any, next: any) => {
    try {
        const user: any = await getUserByIdService(req.params.id);
        if (!user) {
            return handleResponse(res, 404, "user not found", null);
        }
        handleResponse(res, 200, "users retrieved successfully", user)
    } catch (err) {
        next(err);
    }
}
export const updateUser = async (req: any, res: any, next: any) => {

    const { name, email } = req.body;

    try {
        const updatedUser: any = await updateUserService(req.params.id, name, email);

        if (!updatedUser) {
            return handleResponse(res, 404, "user not found", null);
        }
        handleResponse(res, 200, "user updated  successfully", updatedUser)
    } catch (err) {
        next(err);
    }
}

export const deleteUser = async (req: any, res: any, next: any) => {


    try {
        const deletedUser: any = await deleteUserService(req.params.id);

        if (!deletedUser) {
            return handleResponse(res, 404, "user not found", null);
        }
        handleResponse(res, 200, "user deleted  successfully", deletedUser)
    } catch (err) {
        next(err);
    }
}


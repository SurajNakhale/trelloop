import {type loginInput, type registerInput } from "../types";
import { prisma } from "../client";
import { generateToken } from "../lib/jwt";
import { ApiError } from "../utlis/ApiError";
import { hashpass } from "../lib/hashpass";
import { comparePass } from "../lib/comparepass";

export const register = async (data: registerInput ) => {
    const username = data.username;
    const password = data.password;

        const existingUser = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if(existingUser) throw new ApiError(409, "User already exists")

        const hashpassword = await hashpass(password);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashpassword
            },
            select: {
                id: true,
                username: true,
                createdAt: true
            }
        })

        const token = generateToken(newUser.id);


        return {
            message: "User registered successfully",
            token,
            user: newUser
        }
}

export const login = async (data: loginInput) => {
    const username = data.username;
    const password = data.password;

    const existingUser = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if(!existingUser) throw new ApiError(401, "User does not found")

    const matchPass = comparePass(password, Buffer.from(existingUser.password));
    if(!matchPass) throw new ApiError(401, "Invalid password");

    const token = generateToken(existingUser.id);

    return {
        message: "user login successfully",
        token,
        user: {
            id: existingUser.id,
            username: existingUser.username,
            createdAt: existingUser.createdAt
        }
    }
}

export const userInfo = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id: true,
            username: true,
            createdAt: true
        }
    })

    if(!user) throw new ApiError(401, "User not found");

    return {
        userInfo: user
    }
} 
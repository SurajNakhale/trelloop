import { prisma } from "../client";
import { OrgRole } from "../generated/prisma/enums";
import type { createBoardInput } from "../types";
import { ApiError } from "../utlis/ApiError";
import { HTTP_STATUS } from "../utlis/http";
async function checkRole(userId: string, orgId: string){
    const result = await prisma.member.findFirst({
        where: {
            userId,
            orgId
        },
        select: {
            role: true
        }
    })

    return result?.role;
}
export const createBoard = async (userId: string, orgId: string, data: createBoardInput) => {
    const title = data.title;

    const role = await checkRole(userId, orgId);
    if(role == OrgRole.ADMIN || role == OrgRole.OWNER){
        const newBoard = await prisma.board.create({
            data: {
                title: title,
                orgId: orgId,
            }
        })

        return newBoard
    }

    return new ApiError(HTTP_STATUS.UNAUTHORIZED, "does not have acccess to create board")
}
export const getAllBoards = async (orgId: string) => {
    
    const allBoards = await prisma.board.findMany({
        where: {
            orgId
        }
    })

    return allBoards.map((x) => ({
        id: x.id,
        title: x.title,
        createdAt: x.createdAt
    }))

}
export const getBoard = async (orgId: string, boardId: string) => {
    
    const board = await prisma.board.findFirst({
        where: {
            id: boardId,
            orgId
        },
        select: {
            id: true,
            title: true,
            createdAt: true
        }
    })

    return board

}
export const updateBoard = async (data: createBoardInput, boardId: string, orgId: string, userId: string) => {
    
    const role = await checkRole(userId, orgId);

    if(role == OrgRole.ADMIN || role == OrgRole.OWNER){

        const updated = await prisma.board.update({
            where: {
                id: boardId
            },
            data: {
                title: data.title
            }
        })

        return updated;
    }

}
export const deleteBoard = async (boardId: string, orgId: string, userId: string) => {
    
    const role = await checkRole(userId, orgId);

    if(role == OrgRole.ADMIN || role == OrgRole.OWNER){
        await prisma.board.delete({
            where: {
                id: boardId
            }
        })
    }
}
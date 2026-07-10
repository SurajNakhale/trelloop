import { prisma } from "../client";
import { OrgRole } from "../generated/prisma/enums";
import type { createBoardInput } from "../types";
import { ApiError } from "../utlis/ApiError";
import { HTTP_STATUS } from "../utlis/http";

export const createBoard = async (orgId: string, data: createBoardInput, role: OrgRole) => {
    const title = data.title;

    if(role == OrgRole.ADMIN || role == OrgRole.OWNER){
        const newBoard = await prisma.board.create({
            data: {
                title: title,
                orgId: orgId,
            }
        })

        return newBoard
    }else{
        throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        "You don't have permission to create boards."
        );
    }
}
export const getAllBoards = async (orgId: string) => {
    
    const allBoards = await prisma.board.findMany({
        where: {
            orgId
        }
    })

     if (!allBoards) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Board not found"
        );
    }

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

    if (!board) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Board not found"
        );
    }

    return board

}
export const updateBoard = async (data: createBoardInput, boardId: string,orgId: string, role: OrgRole) => {

    
    const board = await prisma.board.findFirst({
        where: {
            id: boardId,
            orgId
        }
    });

    if(!board){
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Board not found"
        );
    }

    if(role == OrgRole.ADMIN || role == OrgRole.OWNER){

        const updated = await prisma.board.update({
            where: {
                id: board.id,
            },
            data: {
                title: data.title
            }
        })

        return updated;
    }

}
export const deleteBoard = async (boardId: string, orgId: string, role: OrgRole) => {

    if (role !== OrgRole.ADMIN && role !== OrgRole.OWNER) {
        throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "You don't have permission to update this board."
        );
    }
    

    const board = await prisma.board.findFirst({
        where: {
            id: boardId,
            orgId
        }
    });

    if(!board){
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Board not found"
        );
    }

    await prisma.board.delete({
        where: {
            id: board.id
        }
    })
    
}
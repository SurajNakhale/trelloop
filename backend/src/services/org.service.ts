import { prisma } from "../client";
import { OrgRole } from "../generated/prisma/enums";
import type { createOrgData } from "../types";
import { ApiError } from "../utlis/ApiError";
import { HTTP_STATUS } from "../utlis/http";

export const creation = async (data: createOrgData, userId: string) => {
    const name = data.name;
    const description = data.description;

    const newOrg = await prisma.org.create({
        data: {
            name,
            description
        },
        select: {
            id: true,
            name: true
        }
    })

    await prisma.member.create({
        data: {
            userId: userId,
            orgId: newOrg.id,
            role: OrgRole.OWNER
        }
    })

    return {
        id: newOrg.id,
        name: newOrg.name
    }
}

export const getAllOrgDetails = async (userId: string) => {

    const details = await prisma.member.findMany({
        where:{
            userId: userId,
            role: OrgRole.OWNER
        },
        include: {
            org: true,
        }
    })

    return details.map(x => ({
        orgDetail: x.org
    }))
}

export const orgDetails = async (orgId: string, userId: string) => {

    const result = await prisma.member.findFirst({
        where:{
            userId: userId,
            orgId: orgId
        },
        include:{
            org: true
        }
    })

    return result?.org
}
async function checkRole(userId: string, orgId: string){
    const member = await prisma.member.findFirst({ 
        where: { 
            userId, 
            orgId 
        } 
    });
    return member?.role ?? null;
}

export const updateOrg = async (orgId: string, data: createOrgData, userId:string,) => {

    const role = await checkRole(userId, orgId);

    if(role === OrgRole.OWNER || role === OrgRole.ADMIN){
        const result = await prisma.org.update({
            where: {
                id: orgId
            },
            data:{
                name: data.name,
                description: data.description
            }
        })

        return {
            message: "updated successfully",
            result
        }
    }

    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "does not have access to update")
}

export const deleteOrg = async (orgId: string, userId: string) => {
    
    const role = await checkRole(userId, orgId);

    if(role === OrgRole.ADMIN || role === OrgRole.OWNER){
        await prisma.org.delete({ 
            where: { 
                id: orgId 
            } 
        });
        return true;
    }

    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "required access");

}

export const addMembers = async (orgId: string, memberId: string, userId: string) => {
    //check if user exists
    const user = await prisma.user.findUnique({
        where: {
            id: memberId
        }
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const role = await checkRole(userId, orgId);

    if(role == "ADMIN" || role == "OWNER"){
        const existingMember = await prisma.member.findUnique({
            where: {
                userId_orgId: {
                    userId: memberId,
                    orgId
                }
            }
        });

        if (existingMember) {
            throw new ApiError(409, "User is already a member");
        }

        const newMember = await prisma.member.create({
            data: {
                userId: memberId,
                orgId: orgId,
            },
            select: {
                userId: true,
                orgId: true,
                role: true,
                createdAt: true
            }
        })


        return newMember
    }

    throw new ApiError(403, "You don't have permission to add members.");
}


export const getAllMembers = async(orgId: string, userId: string) => {
    
    const role = await checkRole(userId, orgId);

    if(role === OrgRole.ADMIN || role === OrgRole.OWNER){
        const users = await prisma.member.findMany({
            where: {
                orgId
            },
            include: {
                user: true
            }
        })

        return users.map((x) => ({
            id: x.user.id,
            name: x.user.username
        }))
    }

    throw new ApiError(403, "You don't have permission.");

}

export const deleteMember = async (orgId: string, memberId: string, userId: string) => {
    const role = await checkRole(userId, orgId);

    if(role === OrgRole.OWNER){
        await prisma.member.delete({ 
            where: { 
                id: memberId 
            } 
        });
        return true;
    }

    throw new ApiError(403, "You don't have permission to delete member.");

}
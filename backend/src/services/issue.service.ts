import { prisma } from "../client";
import { OrgRole } from "../generated/prisma/enums";
import type { createIssueInput, updateIssueInput } from "../types";
import { ApiError } from "../utlis/ApiError";
import { HTTP_STATUS } from "../utlis/http";

export const createIssue = async(boardId: string, data: createIssueInput) => {

    const newIssue = await prisma.issue.create({
        data: {
            title: data.title,
            boardId: data.boardId,
            description: data.description,
            assigneeId: data.assigneeId,
            priority: data.priority,
            status: data.status,
        },
    });

    if(!newIssue) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "issue creation failed");

    return newIssue
}

export const getAllIssue = async(boardId: string) => {
    const issues = await prisma.issue.findMany({
        where: {
            boardId
        }
    });

    if(!issues) throw new ApiError(HTTP_STATUS.NOT_FOUND, "issues not found");

    return issues.map((x) => x)
}

const checkIssue = async(issueId: string) => {
    const exists = await prisma.issue.findFirst({
        where: {
            id: issueId
        }
    })

    if(!exists) throw new ApiError(HTTP_STATUS.NOT_FOUND, "issue does not exists");

    return exists
}

const verifyrole = (role: OrgRole) => {
     if(role != OrgRole.ADMIN && role != OrgRole.OWNER){
        throw new ApiError(
            HTTP_STATUS.FORBIDDEN,
            "You don't have permission to update this issue."
        );
    }
}

export const updateIssue = async(data: updateIssueInput, issueId: string, role: OrgRole) => {
    //check if issue exists
    const issue = await checkIssue(issueId);

    verifyrole(role);

    const updatedIssue = await prisma.issue.update({
        where: {
            id: issue.id
        },
        data: {
            title: data.title,
            description: data.description,
            status: data.status,
            boardId: data.boardId,
            priority: data.priority,
            assigneeId: data.assigneeId
        }
    })

    if(!updatedIssue) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "issue does not update");

    return updatedIssue
}

export const deleteIssue = async(issueId: string, role: OrgRole) => {
    const issue = await checkIssue(issueId);
    verifyrole(role);

    const deletedIssue = await prisma.issue.delete({
        where: {
            id: issue.id
        }
    })
    
    if(!deletedIssue) throw new ApiError(HTTP_STATUS.BAD_REQUEST, "issue not deleted");

    return deletedIssue;
}
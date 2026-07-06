import bcrypt from "bcrypt";

export const comparePass = (password:string, hashpassword:  Buffer<ArrayBufferLike>) => {
    return bcrypt.compare(password, hashpassword.toString("utf-8"))
}
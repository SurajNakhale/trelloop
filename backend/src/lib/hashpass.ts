import bcrypt from "bcrypt";

export const hashpass = async (password: string) => {
    return bcrypt.hash(password, 10);
}
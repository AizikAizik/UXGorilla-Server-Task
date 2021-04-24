import bcrypt from 'bcryptjs';


async function hashPassword(password){
    const salt = await bcrypt.genSalt(14);
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword;
}

async function validateHashPassword(enteredPassword, hashedPassword){
    return await bcrypt.compare(enteredPassword, hashedPassword);
}

export { validateHashPassword, hashPassword }
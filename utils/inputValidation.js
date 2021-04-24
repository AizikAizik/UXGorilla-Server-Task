import inputValidator from 'password-validator';

function validateUsername(username){
    const schema = new inputValidator();

    schema
        .is().min(4)
        .is().letters()
        .has().not().digits()
        .has().lowercase()
        .has().not().uppercase()
        .has().not(/[~`!@#$%^&()_={}[\]:;,.<>+\/?-]/)
        .has().not().spaces();

    return schema.validate(username);
}

function validatePassword(password){
    const schema = new inputValidator();

    schema
    .is().min(5)
    .is().digits(1)
    .is().letters()
    .has().lowercase(1)
    .has().not().spaces()
    .has().not(/[~`!@#$%^&()_={}[\]:;,.<>+\/?-]/)
    .has().uppercase(1);

    return schema.validate(password);
}

function validateName(name){
    const schema = new inputValidator();

    schema
        .is().letters()
        .has(/^[a-zA-Z]+$/)
        .has().not().digits()
        .has().not(/[~`!@#$%^&()_={}[\]:;,.<>+\/?-]/)
        .has().not().spaces();

    return schema.validate(name);
}

export { 
    validateUsername,
    validatePassword,
    validateName
}
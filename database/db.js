import fs from 'fs';

const getUsersJson = fs.readFileSync('./database/users.json', {encoding: 'utf-8'});

const Users = JSON.parse(getUsersJson);

export { Users };
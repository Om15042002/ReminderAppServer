
const { Client } = require('pg')

const client = new Client({
    host: "172.16.4.64",
    user: 'postgres',
    port: 5432,
    password: '99$inmedi',
    database: 'todoDB'
})

client.connect()
console.log(client);
module.exports={
    client
}
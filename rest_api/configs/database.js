const {Pool} = require('pg')

const connectionString = process.env.NODE_ENV === 'test' ? 
'postgresql://postgres:password@localhost:5432/test_blogs': process.env.DATABASE_URL;

const pool = new Pool({ connectionString })

module.exports = pool;
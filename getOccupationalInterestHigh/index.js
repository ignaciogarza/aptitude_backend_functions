require('dotenv').config()
const sql = require('mssql');

module.exports = async function (context, req) {
    
    const sqlConfig = {
        user: process.env.DB_USER || process.env["DB_USER"],
        password: process.env.DB_PWD || process.env["DB_PWD"],
        database: process.env.DB_NAME || process.env["DB_NAME"],
        server: process.env.DB_HOST || process.env["DB_HOST"],
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000
        },
        options: {
          encrypt: true, 
          trustServerCertificate: false 
        }
      }

      try {
        await sql.connect(sqlConfig)
        const result = await sql.query`
        SELECT 
        test.position,
        test.question,
        sections.sectionName,
        sections.section_description,
        test.section
        FROM test_occupationalInterest AS test
        INNER JOIN [dbo].[occupationalInterest_sections] AS sections
            ON sections.sectionNumber = test.section
        WHERE test.agelevel = 1 AND test.visibility = 1
        ORDER BY test.section ASC, test.[position] ASC;
        `;
        context.res = {
            status:200,
            body: result
        };

    } catch (err) {
        // ... error checks
        context.res = {
            status: 400,
            body: err
        };
       }

}
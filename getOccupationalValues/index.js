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
        test.position AS Position,
        catA.category AS OptionA,
        catB.category AS OptionB,
        catA.categoryDesc AS DescriptionA,
        catB.categoryDesc AS DescriptionB
        FROM test_occupationalValues AS test
        INNER JOIN [dbo].[categories] AS catA
            ON test.valueA = catA.categoryID
        INNER JOIN [dbo].[categories] AS catB
            ON test.valueB = catB.categoryID
        WHERE test.visibility = 1;
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

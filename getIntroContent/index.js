require('dotenv').config()
const sql = require('mssql');

module.exports = async function (context, req) {
    const idNumber = req.params.id;

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
        intro_exam_description.introID,
        intro_exam_description.title,
        intro_exam_description.subtitle,
        intro_exam_description.content
        FROM [dbo].[intro_exam_description]
        WHERE introID = ${idNumber};
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

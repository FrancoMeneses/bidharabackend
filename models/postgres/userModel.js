import pg from 'pg'
const { Client } = pg

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Bidhara',
  port: 5432
})

await client.connect()

export async function getOneByName ({ body }) {
  console.log(body)
  const { name, password } = body
  let res = {
    success: false,
    message: '',
    code: 0
  }
  try {
    const query = {
      text: `SELECT *
    FROM users
      WHERE user_name = $1;`,
      values: [name]
    }
    const { rows } = await client.query(query)
    console.log(rows)
    if (rows.length === 0) {
      res.message = 'User not found'
      return res
    } else {
      if (rows[0].user_pwd === password) {
        res = {
          success: true,
          message: rows[0],
          code: 2
        }
      } else {
        res = {
          success: false,
          message: 'Password is not valid',
          code: 1
        }
      }
    }
    return res
  } catch (error) {
    console.log(error)
    res = {
      success: false,
      message: error
    }
    return res
  }
}

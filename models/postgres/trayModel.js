import pg from 'pg'
import QRCode from 'qrcode'
const { Client } = pg

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Bidhara',
  port: 5432
})

await client.connect()

export async function getAll () {
  try {
    const { rows } = await client.query('SELECT * FROM trays_wname_createdby;')
    console.log(rows)
    return rows
  } catch (error) {
    console.log(error)
  }
}

export async function getOne ({ id }) {
  let res = {
    success: false,
    message: ''
  }
  try {
    const query = {
      text: `SELECT tray_id, product_name, tray_createdat, tray_comment, tray_status, tray_quality, tray_percentage, tray_qrdata, category_name, user_name AS created_by
    FROM trays
    JOIN users ON trays.created_by = users.user_id
      JOIN categories ON trays.category_id = categories.category_id
      JOIN products ON trays.product_id = products.product_id
      WHERE tray_id = $1;`,
      values: [id]
    }
    const { rows } = await client.query(query)
    console.log(rows)
    if (rows[0].length === 0) {
      res.message = 'Tray not found'
      return res
    }
    res = {
      success: true,
      message: rows[0]
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

export async function createOne ({ data }) {
  let res = {
    success: false,
    message: ''
  }
  try {
    const { productId, trayComment = '', categoryId, trayStatus = true, trayQuality = 'Bueno', trayPercentage = 100, createdBy = "(SELECT user_id FROM users WHERE user_email = 'meneses773@gmail.com')" } = data
    const response = await client.query('SELECT gen_random_uuid();')
    const uuid = response.rows[0].gen_random_uuid
    console.log(uuid)
    const qrData = await QRCode.toDataURL(`http://192.168.0.139:1222/trays/${uuid}`)
    const query = {
      text: `INSERT INTO trays 
      (tray_id, product_id, tray_comment, category_id, tray_status, tray_quality, tray_percentage, tray_qrdata, created_by) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
      values: [uuid, productId, trayComment, categoryId, trayStatus, trayQuality, trayPercentage, qrData, createdBy]
    }
    const { rows } = await client.query(query)
    res = {
      success: true,
      message: rows[0]
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

export async function editOne ({ id }, body) {
  let res = {
    success: false,
    message: ''
  }

  try {
    const query = {
      text: `SELECT product_id, tray_comment, category_id, tray_status, tray_quality, tray_percentage 
      FROM trays
      WHERE $1 = tray_id;`,
      values: [id]
    }
    const { rows } = await client.query(query)

    if (rows[0].length === 0) {
      res.message = 'Tray not found'
      return res
    }

    const {
      productId = rows[0].product_id,
      trayComment = rows[0].tray_comment,
      categoryId = rows[0].category_id,
      trayStatus = rows[0].tray_status,
      trayQuality = rows[0].tray_quality,
      trayPercentage = rows[0].tray_percentage
    } = body

    const updateQuery = {
      text: `UPDATE trays 
      SET product_id = $1, tray_comment = $2, category_id = $3, tray_status = $4, tray_quality = $5, tray_percentage = $6
      WHERE $7 = tray_id;`,
      values: [productId, trayComment, categoryId, trayStatus, trayQuality, trayPercentage, id]
    }
    const resUpdate = await client.query(updateQuery)
    res = {
      success: true,
      message: resUpdate.rows[0]
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

export async function deleteOne ({ id }) {
  let res = {
    success: false,
    message: ''
  }

  try {
    const query = {
      text: 'DELETE FROM trays WHERE tray_id = $1',
      values: [id]
    }
    const { rows } = await client.query(query)
    res = {
      success: true,
      message: rows[0]
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

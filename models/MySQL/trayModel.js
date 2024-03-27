import mysql from 'mysql2/promise'
import QRCode from 'qrcode'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  database: 'Bidhara'
}

const connection = await mysql.createConnection(config)

export async function getAll () {
  try {
    const [results] = await connection.query('SELECT * FROM trays_wname_createdby;')
    return results
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
    const SQL = `SELECT BIN_TO_UUID(tray_id) tray_id, product_name, tray_createdat, tray_comment, tray_status, tray_quality, tray_percentage, tray_qrdata, category_name, user_name AS created_by
    FROM trays
    JOIN users ON trays.created_by = users.user_id
      JOIN categories ON trays.category_id = categories.category_id
      JOIN products ON trays.product_id = products.product_id
      WHERE tray_id = UUID_TO_BIN(?);`
    const [result] = await connection.query(SQL, [id])
    if (result.length === 0) {
      res.message = 'Tray not found'
      return res
    }
    res = {
      success: true,
      message: result
    }
    return res
  } catch (error) {
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
    const { productId, trayComment = '', categoryId, trayStatus = 100, trayQuality = 'Bueno', trayPercentage = 100, createdBy = '@MAIN_USER' } = data
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    const qrData = await QRCode.toDataURL(`http://192.168.0.139:1222/trays/${uuid}`)
    const SQL =
    `INSERT INTO trays 
    (tray_id, product_id, tray_comment, category_id, tray_status, tray_quality, tray_percentage, tray_qrdata, created_by) 
    VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, UUID_TO_BIN(?));`
    const [result] = await connection.query(SQL, [uuid, productId, trayComment, categoryId, trayStatus, trayQuality, trayPercentage, qrData, createdBy])
    res = {
      success: true,
      message: result
    }
    return res
  } catch (error) {
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
    const SQL = `SELECT product_id, tray_comment, category_id, tray_status, tray_quality, tray_percentage 
    FROM trays
    WHERE UUID_TO_BIN(?) = tray_id;`
    const [result] = await connection.query(SQL, [id])

    if (result.length === 0) {
      res.message = 'Tray not found'
      return res
    }

    const {
      productId = result[0].product_id,
      trayComment = result[0].tray_comment,
      categoryId = result[0].category_id,
      trayStatus = result[0].tray_status,
      trayQuality = result[0].tray_quality,
      trayPercentage = result[0].tray_percentage
    } = body

    const UPDATE = `UPDATE trays 
    SET product_id = ?, tray_comment = ?, category_id = ?, tray_status = ?, tray_quality = ?, tray_percentage = ?
    WHERE UUID_TO_BIN(?) = tray_id;`
    const [resUpdate] = await connection.query(UPDATE, [productId, trayComment, categoryId, trayStatus, trayQuality, trayPercentage, id])
    res = {
      success: true,
      message: resUpdate
    }
    return res
  } catch (error) {
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
    const SQL = 'DELETE FROM trays WHERE UUID_TO_BIN(?) = tray_id'
    const [result] = await connection.query(SQL, [id])
    res = {
      success: true,
      message: result
    }
    return res
  } catch (error) {
    res = {
      success: false,
      message: error
    }
    return res
  }
}

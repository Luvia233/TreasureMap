const cloud = require('wx-server-sdk')
const { getUserWithFamily } = require('../utils/common')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const db = cloud.database()
    const openid = wxContext.openid

    // 使用公共模块获取用户及家庭信息
    const userResult = await getUserWithFamily(db, openid)
    if (!userResult.success) {
      return { success: false, error: userResult.error }
    }

    const { familyId } = userResult

    const items = await db.collection('items')
      .where({ family_id: familyId })
      .orderBy('created_at', 'desc')
      .get()

    return { success: true, data: items.data }

  } catch (err) {
    console.error('获取物品列表云函数错误', err)
    return { success: false, error: err.message || '获取失败' }
  }
}
const cloud = require('wx-server-sdk')
const { getUserWithFamily } = require('../utils/common')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { itemId } = event

  // 输入校验
  if (!itemId || typeof itemId !== 'string') {
    return { success: false, error: '物品ID无效' }
  }

  try {
    const db = cloud.database()
    const openid = wxContext.openid

    // 使用公共模块获取用户及家庭信息
    const userResult = await getUserWithFamily(db, openid)
    if (!userResult.success) {
      return { success: false, error: userResult.error }
    }

    const { familyId } = userResult

    const itemRes = await db.collection('items')
      .doc(itemId)
      .get()

    if (!itemRes.data) {
      return { success: false, error: '物品不存在' }
    }

    // 检查物品是否属于该用户的家庭
    if (itemRes.data.family_id !== familyId) {
      return { success: false, error: '无权访问此物品' }
    }

    return { success: true, data: itemRes.data }

  } catch (err) {
    console.error('获取物品云函数错误', err)
    return { success: false, error: err.message || '获取失败' }
  }
}
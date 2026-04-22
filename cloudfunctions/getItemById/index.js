const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { itemId } = event

  if (!itemId || typeof itemId !== 'string') {
    return { success: false, error: '物品ID无效' }
  }

  try {
    const db = cloud.database()
    const openid = wxContext.openid

    const users = await db.collection('users')
      .where({ openid: openid })
      .limit(1)
      .get()

    if (users.data.length === 0) {
      return { success: false, error: '用户不存在' }
    }

    const familyId = users.data[0].family_id

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
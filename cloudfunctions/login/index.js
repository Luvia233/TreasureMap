const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { code } = event

  try {
    const openid = wxContext.openid
    const db = cloud.database()

    const users = await db.collection('users')
      .where({ openid: openid })
      .limit(1)
      .get()

    if (users.data.length > 0) {
      const user = users.data[0]
      return {
        success: true,
        data: {
          userId: user._id,
          userInfo: {
            nickname: user.nickname,
            avatar: user.avatar || ''
          },
          familyId: user.family_id || null
        }
      }
    }

    // 新用户，返回明确的 null 值
    return {
      success: true,
      data: {
        userId: null,
        userInfo: { nickname: '新用户', avatar: '' },
        familyId: null
      }
    }

  } catch (err) {
    console.error('登录云函数错误', err)
    return { success: false, error: err.message || '登录失败' }
  }
}
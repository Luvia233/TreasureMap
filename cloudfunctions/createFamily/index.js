const cloud = require('wx-server-sdk')
const { generateInviteCode } = require('../utils/inviteCode')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { familyName, nickname } = event

  try {
    const db = cloud.database()
    const openid = wxContext.openid

    const familyRes = await db.collection('families').add({
      data: {
        name: familyName,
        owner_openid: openid,
        created_at: db.serverDate()
      }
    })

    const familyId = familyRes._id

    const inviteCode = generateInviteCode(8)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await db.collection('invite_codes').add({
      data: {
        family_id: familyId,
        code: inviteCode,
        max_uses: 5,
        used_count: 0,
        expires_at: expiresAt,
        created_at: db.serverDate()
      }
    })

    const userRes = await db.collection('users').add({
      data: {
        openid: openid,
        nickname: nickname,
        family_id: familyId,
        role: 'owner',
        created_at: db.serverDate()
      }
    })

    return {
      success: true,
      data: { familyId, userId: userRes._id, inviteCode }
    }

  } catch (err) {
    console.error('创建家庭云函数错误', err)
    return { success: false, error: err.message || '创建失败' }
  }
}

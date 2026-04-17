const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { inviteCode, nickname } = event

  try {
    const db = cloud.database()
    const openid = wxContext.openid

    const codes = await db.collection('invite_codes')
      .where({
        code: inviteCode.toUpperCase(),
        used_count: db.command.lt(5)
      })
      .limit(1)
      .get()

    if (codes.data.length === 0) {
      return { success: false, error: '邀请码无效或已过期' }
    }

    const codeRecord = codes.data[0]
    const familyId = codeRecord.family_id

    if (new Date() > new Date(codeRecord.expires_at)) {
      return { success: false, error: '邀请码已过期' }
    }

    const userRes = await db.collection('users').add({
      data: {
        openid: openid,
        nickname: nickname,
        family_id: familyId,
        role: 'member',
        created_at: db.serverDate()
      }
    })

    await db.collection('invite_codes')
      .doc(codeRecord._id)
      .update({
        data: {
          used_count: db.command.inc(1)
        }
      })

    return {
      success: true,
      data: { familyId, userId: userRes._id }
    }

  } catch (err) {
    console.error('加入家庭云函数错误', err)
    return { success: false, error: err.message || '加入失败' }
  }
}

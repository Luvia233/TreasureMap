/**
 * 云函数公共工具模块
 * 提供用户校验、家庭校验等公共方法
 */

/**
 * 获取用户信息
 * @param {Database} db 云数据库实例
 * @param {string} openid 用户openid
 * @returns {Object} { success, user, error }
 */
async function getUser(db, openid) {
  const users = await db.collection('users')
    .where({ openid: openid })
    .limit(1)
    .get()

  if (users.data.length === 0) {
    return { success: false, error: '用户不存在' }
  }

  return { success: true, user: users.data[0] }
}

/**
 * 获取用户信息及家庭ID
 * @param {Database} db 云数据库实例
 * @param {string} openid 用户openid
 * @returns {Object} { success, user, familyId, error }
 */
async function getUserWithFamily(db, openid) {
  const result = await getUser(db, openid)
  if (!result.success) {
    return result
  }

  const user = result.user

  if (!user.family_id) {
    return { success: false, error: '用户未加入家庭' }
  }

  return {
    success: true,
    user,
    familyId: user.family_id
  }
}

/**
 * 验证用户是否属于指定家庭
 * @param {Database} db 云数据库实例
 * @param {string} openid 用户openid
 * @param {string} familyId 家庭ID
 * @returns {Object} { success, error }
 */
async function verifyUserInFamily(db, openid, familyId) {
  const result = await getUserWithFamily(db, openid)

  if (!result.success) {
    return result
  }

  if (result.familyId !== familyId) {
    return { success: false, error: '无权访问此家庭数据' }
  }

  return { success: true }
}

/**
 * 检查用户是否已存在
 * @param {Database} db 云数据库实例
 * @param {string} openid 用户openid
 * @returns {Object} { exists: boolean }
 */
async function checkUserExists(db, openid) {
  const users = await db.collection('users')
    .where({ openid: openid })
    .limit(1)
    .get()

  return { exists: users.data.length > 0 }
}

/**
 * 检查邀请码是否有效
 * @param {Database} db 云数据库实例
 * @param {string} code 邀请码
 * @returns {Object} { success, codeRecord, familyId, error }
 */
async function verifyInviteCode(db, code) {
  const upperCode = code.toUpperCase().trim()

  const codes = await db.collection('invite_codes')
    .where({
      code: upperCode,
      used_count: db.command.lt(5)
    })
    .limit(1)
    .get()

  if (codes.data.length === 0) {
    return { success: false, error: '邀请码无效或已过期' }
  }

  const codeRecord = codes.data[0]

  if (new Date() > new Date(codeRecord.expires_at)) {
    return { success: false, error: '邀请码已过期' }
  }

  return {
    success: true,
    codeRecord,
    familyId: codeRecord.family_id
  }
}

/**
 * 生成唯一邀请码（带重试）
 * @param {Database} db 云数据库实例
 * @param {Function} generateCodeFn 生成邀请码的函数
 * @param {number} length 邀请码长度
 * @param {number} maxRetries 最大重试次数
 * @returns {Object} { success, code, error }
 */
async function generateUniqueInviteCode(db, generateCodeFn, length = 8, maxRetries = 5) {
  let retries = 0

  while (retries < maxRetries) {
    const code = generateCodeFn(length)
    const existing = await db.collection('invite_codes')
      .where({ code })
      .limit(1)
      .get()

    if (existing.data.length === 0) {
      return { success: true, code }
    }

    retries++
  }

  return { success: false, error: '生成邀请码失败，请重试' }
}

module.exports = {
  getUser,
  getUserWithFamily,
  verifyUserInFamily,
  checkUserExists,
  verifyInviteCode,
  generateUniqueInviteCode
}
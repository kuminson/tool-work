/**
 * 计算字符串宽度
 * @param {{}} widthObj - 字符宽度数据对象
 * @param {string} text - 要计算的字符串
 * @param {number} fontSize - 字体大小
 * @param {number} [letterSpacing] - 字符间距
 * @param {number} [wordSpacing] - 空格宽度
 */
export function getTextSize(
  widthObj,
  text,
  fontSize,
  letterSpacing = 0,
  wordSpacing = 0
) {
  let width = 0
  const zh_letter = new RegExp('[\u4E00-\u9FA5]+')
  const zh_symbol =
    '０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ｀－＝【】、；‘’，。／＼～！＠＃￥％…＆×（）—＋｛｝｜：“”《》？〈〉＜＞〔〕〖〗『』'
  text.split('').forEach(item => {
    if (zh_letter.test(item) || zh_symbol.indexOf(item) !== -1) {
      if (item === ' ' && wordSpacing !== 0) {
        width += fontSize + wordSpacing
      } else {
        width += fontSize
      }
    } else {
      width += fontSize * (widthObj[item] || 1)
    }
  })
  if (letterSpacing !== 0) {
    width += letterSpacing * text.length
  }
  return width
}

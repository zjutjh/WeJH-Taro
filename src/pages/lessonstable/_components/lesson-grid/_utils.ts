import { Lesson } from "@/types/lesson";

/**
 * 生成课程在 v-for 中的唯一 key
 * 为了避免重复 key 出现，使用 id、week、weekday、sections、stack 五个属性组合
 * 新增了 stack（层数）作为 key 的一部分，用于区分冲突层的相同课程
 */
export function lessonKey(cl: Lesson) {
  return `${cl.id}-${cl.week}-${cl.weekday}-${cl.sections}-${cl.stack || 0}`;
}

/**
 * 拆分教学楼与具体房间号
 * @example
 * // 返回：["子良", "A347"]
 * splitNameAndRoom("子良A347")
 */
export function splitNameAndRoom(str: Lesson["lessonPlace"]) {
  let index = 0;

  while (index < str.length) {
    const code = str.codePointAt(index);
    if (code && code <= 255) break;
    index++;
  }
  return [str.slice(0, index), str.slice(index)];
}

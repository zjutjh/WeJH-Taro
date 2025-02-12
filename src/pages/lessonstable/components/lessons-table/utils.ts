import { Lesson } from "@/types/Lesson";

/**
 * 按课程在一个星期内的开始时间排序（不修改原数组）
 * 如果两门课程的开始时间相同，结束时间早的排在前面
 */
export function toSortedLessons(list: Lesson[]) {
  return [...list].sort((a, b) => {
    if (a.weekday < b.weekday) return -1;
    if (a.weekday > b.weekday) return 1;

    const [aStart, aEnd] = a.sections.split("-");
    const [bStart, bEnd] = b.sections.split("-");

    if (+aStart < +bStart) return -1;
    if (+aStart > +bStart) return 1;

    return (+aEnd) - (+bEnd);
  });
}

/**
 * 寻找四周的课程
 * @param current 当前课程，以这个课程为中心查找
 * @param sortedLessons 按照课程时间排序的课程列表
 * @returns
 */
export function findSurroundingLessons(current: Lesson, sortedLessons: Lesson[]) {
  const surrounding: Lesson[] = [];

  // 先找上下方向的课程。先找出垂直方向上的全部课程，即同一天
  const upSide = sortedLessons.filter(item => {
    if (item.weekday === current.weekday) {
      // 课程完全在目标上方，或者重叠了一部分，即比较两门课的开始时间
      if (+item.sections.split("-")[0] < +current.sections.split("-")[0])
        return true;
    }
  });
  // 再找到方向上离 current 最近的那一个
  // 因为 sortedLessons 是按照课程时间升序的，upSide 中的所有课程都在 current 之前结束。所以最后一个元素就是最近的
  const upNearestOne = upSide.at(upSide.length - 1);
  if (upNearestOne) {
    // 最后筛选出和他重合的所有课程
    surrounding.push(
      ...upSide.filter(item =>
        item.sections.split("-")[1] === upNearestOne.sections.split("-")[1]
      )
    );
  }

  // 找下方向的课程，原理同上方向
  const downSide = sortedLessons.filter(item => {
    if (item.weekday === current.weekday) {
      // 课程完全在目标下方，或者重叠了一部分，即比较两门课的结束时间
      if (+item.sections.split("-")[1] > +current.sections.split("-")[1])
        return true;
    }
  });
  const downNearestOne = downSide.at(0);
  if (downNearestOne) {
    surrounding.push(
      ...downSide.filter(item =>
        item.sections.split("-")[0] === downNearestOne.sections.split("-")[0]
      )
    );
  }

  // 接着找左右的课程，课程的节次有交叉就算
  const leftSide = sortedLessons.filter(item => {
    if (item.weekday < current.weekday) {
      const [currentStart, currentEnd] = current.sections.split("-");
      const [itemStart, itemEnd] = item.sections.split("-");
      if (+currentStart <= +itemEnd && +currentStart >= +itemStart) return true;
      if (+currentEnd <= +itemEnd && +currentEnd >= +itemStart) return true;
    }
  });
  // 找最近的一个课程，接着找出和他同一天的
  const leftNearestOne = leftSide.at(leftSide.length - 1);
  if (leftNearestOne) {
    surrounding.push(
      ...leftSide.filter(item => item.weekday === leftNearestOne.weekday)
    );
  }

  const rightSide = sortedLessons.filter(item => {
    if (item.weekday > current.weekday) {
      const [currentStart, currentEnd] = current.sections.split("-");
      const [itemStart, itemEnd] = item.sections.split("-");
      if (+currentStart <= +itemEnd && +currentStart >= +itemStart) return true;
      if (+currentEnd <= +itemEnd && +currentEnd >= +itemStart) return true;
    }
  });
  const rightNearestOne = rightSide.at(0);
  if (rightNearestOne) {
    surrounding.push(
      ...rightSide.filter(item => item.weekday === rightNearestOne.weekday)
    );
  }

  return surrounding;
}

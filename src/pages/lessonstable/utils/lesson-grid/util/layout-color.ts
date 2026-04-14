import { Lesson } from "@/types/Lesson";

/**
 * 二维布局：将课程排布到 7x12 网格中，并计算冲突层 stack。
 */
export function buildTwoDimensionalLayout(lessonsList: Lesson[]): Lesson[] {
  if (lessonsList.length === 0) return [];

  const timeGrid = createTimeGrid(lessonsList);
  const laidOutLessons: Lesson[] = [];
  const processedLessons = new Set<string>();

  for (let weekday = 1; weekday <= 7; weekday++) {
    const dayGrid = timeGrid.get(weekday);
    if (!dayGrid) continue;

    let stack = 0;

    for (;;) {
      let hasRemainingLessons = false;
      let nowCell = 1;

      while (nowCell <= 12) {
        const cellLessons = dayGrid.get(nowCell) || [];

        const unprocessedLessons = cellLessons.filter(
          (lesson) => !processedLessons.has(getLessonUniqueId(lesson))
        );

        if (unprocessedLessons.length > 0) {
          hasRemainingLessons = true;

          const longestLesson = selectLongestLesson(unprocessedLessons);
          laidOutLessons.push({
            ...longestLesson,
            stack
          });

          processedLessons.add(getLessonUniqueId(longestLesson));

          const [start, end] = longestLesson.sections.split("-").map(Number);
          for (let section = start; section <= end; section++) {
            const sectionLessons = dayGrid.get(section);
            if (!sectionLessons) continue;
            const index = sectionLessons.findIndex(
              (l) => getLessonUniqueId(l) === getLessonUniqueId(longestLesson)
            );
            if (index !== -1) sectionLessons.splice(index, 1);
          }

          nowCell = end + 1;
        } else {
          nowCell++;
        }
      }

      if (!hasRemainingLessons) break;
      stack++;
    }
  }

  return laidOutLessons;
}

/**
 * 着色：对二维布局后的课程进行图着色，满足相邻/重叠课程尽量不撞色。
 */
export function colorLessons(lessonsList: Lesson[], palette: string[]): Lesson[] {
  if (lessonsList.length === 0) return [];

  const result = lessonsList.map((lesson) => ({ ...lesson }));
  const nodes = result.map((lesson, index) => toLessonColorNode(lesson, index));
  const adjacency = nodes.map(() => new Set<number>());

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (!isHardConflict(nodes[i], nodes[j])) continue;
      adjacency[i].add(j);
      adjacency[j].add(i);
    }
  }

  const order = nodes
    .map((node, idx) => ({ node, index: idx, degree: adjacency[idx].size }))
    .sort((a, b) => {
      if (b.degree !== a.degree) return b.degree - a.degree;
      if (b.node.duration !== a.node.duration) return b.node.duration - a.node.duration;
      if (a.node.weekday !== b.node.weekday) return a.node.weekday - b.node.weekday;
      if (a.node.start !== b.node.start) return a.node.start - b.node.start;
      if (a.node.stack !== b.node.stack) return a.node.stack - b.node.stack;
      return a.node.index - b.node.index;
    });

  const assigned = new Map<number, string>();
  const colorUseCount = new Map<string, number>();
  const classPreferredColor = new Map<string, string>();
  palette.forEach((color) => colorUseCount.set(color, 0));

  for (const { node, index } of order) {
    const neighborColors = new Set<string>();
    adjacency[index].forEach((neighborIdx) => {
      const color = assigned.get(neighborIdx);
      if (color) neighborColors.add(color);
    });

    const availableColors = palette.filter((color) => !neighborColors.has(color));
    const classKey = `${node.stack}-${node.lesson.classID}`;
    const preferred = classPreferredColor.get(classKey);

    let selectedColor = "";

    if (preferred && availableColors.includes(preferred)) {
      selectedColor = preferred;
    } else if (availableColors.length > 0) {
      selectedColor = [...availableColors].sort(
        (a, b) => (colorUseCount.get(a) || 0) - (colorUseCount.get(b) || 0)
      )[0];
    } else {
      selectedColor = [...palette].sort(
        (a, b) => (colorUseCount.get(a) || 0) - (colorUseCount.get(b) || 0)
      )[0];
    }

    assigned.set(index, selectedColor);
    colorUseCount.set(selectedColor, (colorUseCount.get(selectedColor) || 0) + 1);
    classPreferredColor.set(classKey, selectedColor);
    node.lesson.color = selectedColor;
    result[node.index].color = selectedColor;
  }

  return result;
}

function createTimeGrid(lessonsList: Lesson[]): Map<number, Map<number, Lesson[]>> {
  const grid = new Map<number, Map<number, Lesson[]>>();

  for (let weekday = 1; weekday <= 7; weekday++) {
    const dayGrid = new Map<number, Lesson[]>();
    for (let section = 1; section <= 12; section++) {
      dayGrid.set(section, []);
    }
    grid.set(weekday, dayGrid);
  }

  lessonsList.forEach((lesson) => {
    const weekday = parseInt(lesson.weekday);
    const [start, end] = lesson.sections.split("-").map(Number);
    for (let section = start; section <= end; section++) {
      grid.get(weekday)?.get(section)?.push(lesson);
    }
  });

  return grid;
}

function getLessonUniqueId(lesson: Lesson): string {
  return `${lesson.id}-${lesson.week}-${lesson.weekday}-${lesson.sections}`;
}

function selectLongestLesson(lessonsList: Lesson[]): Lesson {
  return lessonsList.reduce((longest, current) => {
    const longestDuration = getLessonDuration(longest);
    const currentDuration = getLessonDuration(current);
    return currentDuration > longestDuration ? current : longest;
  });
}

function getLessonDuration(lesson: Lesson): number {
  const [start, end] = lesson.sections.split("-").map(Number);
  return end - start + 1;
}

type LessonColorNode = {
  index: number;
  lesson: Lesson;
  weekday: number; // 1-7
  start: number; // 起始节次，下同
  end: number;
  stack: number; // 冲突层级0为基础层>=1为冲突层
  duration: number; // 课程时长end-start+1
};

function getLessonStack(lesson: Lesson): number {
  return lesson.stack || 0;
}

function toLessonColorNode(lesson: Lesson, index: number): LessonColorNode {
  const [start, end] = lesson.sections.split("-").map(Number);
  return {
    index,
    lesson,
    weekday: parseInt(lesson.weekday),
    start,
    end,
    stack: getLessonStack(lesson),
    duration: end - start + 1
  };
}

function isSectionsOverlap(sectionsA: string, sectionsB: string): boolean {
  const [startA, endA] = sectionsA.split("-").map(Number);
  const [startB, endB] = sectionsB.split("-").map(Number);
  return !(endA < startB || endB < startA);
}

function isVerticalAdjacent(a: LessonColorNode, b: LessonColorNode): boolean {
  return a.weekday === b.weekday && (a.end + 1 === b.start || b.end + 1 === a.start);
}

function isHorizontalAdjacent(a: LessonColorNode, b: LessonColorNode): boolean {
  return (
    Math.abs(a.weekday - b.weekday) === 1 && isSectionsOverlap(a.lesson.sections, b.lesson.sections)
  );
}
// hard conflict定义：同一天节次重叠，或相邻天节次重叠，或同一天节次相邻
// 对比同函数下其他判断条件这个最优先
function isHardConflict(a: LessonColorNode, b: LessonColorNode): boolean {
  const sameDayOverlap =
    a.weekday === b.weekday && isSectionsOverlap(a.lesson.sections, b.lesson.sections);
  return sameDayOverlap || isHorizontalAdjacent(a, b) || isVerticalAdjacent(a, b);
}

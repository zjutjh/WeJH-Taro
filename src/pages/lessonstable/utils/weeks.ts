export function parseWeeks(weekStr: string): Set<number> {
  const s = new Set<number>();
  if (!weekStr) return s;
  const parts = weekStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  for (const p of parts) {
    const isOdd = p.includes("单");
    const isEven = p.includes("双");
    const match = p.match(/(\d+)(?:-(\d+))?/);
    if (!match) continue;
    const start = parseInt(match[1]);
    const end = match[2] ? parseInt(match[2]) : start;
    for (let w = start; w <= end; w++) {
      if (isOdd && w % 2 === 0) continue;
      if (isEven && w % 2 === 1) continue;
      s.add(w);
    }
  }
  return s;
}

export function formatWeeks(setWeeks: Set<number>): string {
  const arr = Array.from(setWeeks).sort((a, b) => a - b);
  if (arr.length === 0) return "";
  const ranges: string[] = [];
  let start = arr[0];
  let end = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const n = arr[i];
    if (n === end + 1) end = n;
    else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = n;
      end = n;
    }
  }
  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(",");
}

export function isLessonActiveInWeek(lessonWeekStr: string | undefined, week: number): boolean {
  if (!lessonWeekStr) return false;
  for (const time of lessonWeekStr.split(",")) {
    if (time.includes("-")) {
      const start = parseInt(time.split("-")[0]);
      const end = parseInt(time.split("-")[1]);
      if (week <= end && week >= start) {
        if (!time.includes("单") && !time.includes("双")) return true;
        if (time.includes("单") && week % 2 === 1) return true;
        if (time.includes("双") && week % 2 === 0) return true;
      }
    } else if (week === parseInt(time)) return true;
  }
  return false;
}

export function computeOverlapWeeks(aWeek: string, bWeek: string): string {
  const a = parseWeeks(aWeek);
  const b = parseWeeks(bWeek);
  const inter = new Set<number>();
  for (const w of a) if (b.has(w)) inter.add(w);
  return formatWeeks(inter);
}

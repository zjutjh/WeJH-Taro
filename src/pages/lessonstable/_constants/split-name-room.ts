const NAME_ROOM_RE = /^(\P{ASCII}*)([\s\S]*)$/u;

export function splitNameAndRoom(str: string) {
  const match = NAME_ROOM_RE.exec(str);
  return match ? [match[1], match[2]] : [str, ""];
}

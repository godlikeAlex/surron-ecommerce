export const pickRandom = <T>(a: Array<T>): T =>
  a[Math.floor(a.length * Math.random())];


/**
 * 获取错误链最底层的错误信息
 * @param error 可能是Error对象或任意类型
 * @returns 安全返回字符串形式的错误信息
 */
export const getDeepestErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error;
  if (!(error instanceof Error)) return JSON.stringify(error);

  let current = error;
  while (current.cause && current.cause instanceof Error) {
    current = current.cause;
  }
  return current.message;
};

/**
 * 标准化错误处理
 * @param error 原始错误对象
 * @param defaultMsg 默认错误提示
 */
// export const normalizeError = (
//   error: unknown,
//   defaultMsg = '操作失败'
// ): { message: string; original: unknown } => ({
//   message: getDeepestErrorMessage(error) || defaultMsg,
//   original: error
// });

interface MetaMaskError {
  code: number;
  payload?: {
    method: string;
    params: unknown[];
  };
  message: string;
}
/**
 * 不规则error取信息
 * @param error 原始错误对象
 * @param part 1: code 2:message
 */
export const getErrorByStr = (errorStr: string, part: number): number | null | string | object => {
  const match = errorStr.match(/\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/);
  if (!match) return null;

  try {
    const parsed = JSON.parse(match[0]) as Partial<MetaMaskError>;
    if(part === 1)
      return typeof parsed.code === 'number' ? parsed.code : null;
    else if(part === 2)
      return typeof parsed.message === 'string' ? parsed.message : null;
    return parsed;
  } catch {
    return null;
  }
}

// export const getErrorCodeByJSON = (str: string): number | null => {
//   try {
//     const jsonPart = str.match(/\{.*?\}/s)?.[0] || '';
//     const parsed = JSON.parse(jsonPart);
//     return parsed?.code ?? null;
//   } catch {
//     return null;
//   }
// };
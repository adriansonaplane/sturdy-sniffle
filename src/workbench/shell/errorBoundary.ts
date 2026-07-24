export type ErrorKind='route'|'mount'|'activation'|'disposal'|'persistence'|'capability'|'renderer'|'workspace'|'fatal';
export function safeErrorMessage(kind:ErrorKind,error:unknown){ const msg=error instanceof Error?error.message:String(error); return `${kind}: ${msg.replace(/\b(?:\/[\w.-]+){2,}\b/g,'[path]').slice(0,240)}`; }

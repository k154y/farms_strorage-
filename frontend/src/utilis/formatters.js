export const unwrap = (res) => res?.data ?? res;
export const fmtDate = (value) => value ? new Date(value).toLocaleDateString() : "-";
export function getUserHome(): string {
  return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

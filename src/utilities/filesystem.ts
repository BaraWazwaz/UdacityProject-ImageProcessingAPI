import fs from 'fs';

export const INPUT_PATH = 'resources/full';
export const OUTPUT_PATH = 'resources/thumb';

export function fileExistsInOutput(filename: string): boolean {
    if (!filename) return false;
    return fs.existsSync(`${OUTPUT_PATH}/${filename}`);
}

export function fileExistsInInput(filename: string): boolean {
    if (!filename) return false;
    return fs.existsSync(`${INPUT_PATH}/${filename}`);
}

export function getAbsolutePath(filename: string): string {
    return fs.realpathSync(`${OUTPUT_PATH}/${filename}`);
}

export function getFiles(path: string): Array<string> {
    return fs.readdirSync(path);
}

export function deleteFile(filename: string): void {
    fs.rmSync(`${OUTPUT_PATH}/${filename}`, { force: true });
}
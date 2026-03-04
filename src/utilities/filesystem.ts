import fs from 'fs';

export const INPUT_PATH = 'resources/full';
export const OUTPUT_PATH = 'resources/thumb';

export function fileExists(filename: string, directory: string): boolean {
    if (!filename) return false;
    return fs.existsSync(`${directory}/${filename}`);
}

export function getAbsolutePath(filename: string, directory: string): string {
    const root = fs.realpathSync('.');
    return `${root}/${directory}/${filename}`;
}

export function getFiles(directory: string): Array<string> {
    return fs.readdirSync(directory);
}

export function deleteFile(filename: string, directory: string): void {
    fs.rmSync(`${directory}/${filename}`, { force: true });
}

export function readFile(filename: string, directory: string): Buffer {
    return fs.readFileSync(`${directory}/${filename}`);
}

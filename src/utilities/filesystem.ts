import fs from 'fs';

export const inputPath = 'resources/full';
export const outputPath = 'resources/thumb';

export function fileExistsInOutput(filename: string): boolean {
    return fs.existsSync(`${outputPath}/${filename}`);
}

export function fileExistsInInput(filename: string): boolean {
    return fs.existsSync(`${inputPath}/${filename}`);
}

export function getAbsolutePath(filename: string): string {
    return fs.realpathSync(`${outputPath}/${filename}`);
}
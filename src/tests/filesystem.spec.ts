import fs from 'fs';
import * as filesystem from '#utilities/filesystem';

const TEST_THUMB_FILE = 'test-filesystem-spec.jpg';

function createTestFile(directory: string): void {
    if (!fs.existsSync(directory))
        fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(`${directory}/${TEST_THUMB_FILE}`, 'fake image data');
}

function deleteTestFile(directory: string): void {
    const filePath = `${directory}/${TEST_THUMB_FILE}`;
    if (fs.existsSync(filePath))
        fs.rmSync(filePath);
}

describe('filesystem utility', () => {
    beforeEach(() => {
        createTestFile(filesystem.INPUT_PATH);
        createTestFile(filesystem.OUTPUT_PATH);
    });
    afterEach(() => {
        deleteTestFile(filesystem.INPUT_PATH);
        deleteTestFile(filesystem.OUTPUT_PATH);
    });

    it('Exported path constants', () => {
        expect(filesystem.INPUT_PATH).toEqual('resources/full');
        expect(filesystem.OUTPUT_PATH).toEqual('resources/thumb');
    });

    it('fileExistsInInput', () => {
        expect(filesystem.fileExistsInInput(TEST_THUMB_FILE)).toBeTrue();
        expect(filesystem.fileExistsInInput('does-not-exist.jpg')).toBeFalse();
        expect(filesystem.fileExistsInInput('')).toBeFalse();
    });

    it('fileExistsInOutput', () => {
        expect(filesystem.fileExistsInOutput(TEST_THUMB_FILE)).toBeTrue();
        expect(filesystem.fileExistsInOutput('does-not-exist.jpg')).toBeFalse();
        expect(filesystem.fileExistsInOutput('')).toBeFalse();
    });

    it('getFiles', () => {
        expect(filesystem.getFiles(filesystem.OUTPUT_PATH)).toContain(TEST_THUMB_FILE);
        expect(() => filesystem.getFiles('resources/non-existent-dir')).toThrow();
    });

    it('deleteFile', () => {
        expect(filesystem.fileExistsInOutput(TEST_THUMB_FILE)).toBeTrue();
        filesystem.deleteFile(TEST_THUMB_FILE);
        expect(filesystem.fileExistsInOutput(TEST_THUMB_FILE)).toBeFalse();
    });
});

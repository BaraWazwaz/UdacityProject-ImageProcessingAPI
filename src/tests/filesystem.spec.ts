import fs from 'fs';
import * as filesystem from '#utilities/filesystem';

const TEST_THUMB_FILE = 'test-filesystem-spec.jpg';

function createTestFile(directory: string): void {
    if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(`${directory}/${TEST_THUMB_FILE}`, 'fake image data');
}

function deleteTestFile(directory: string): void {
    const filePath = `${directory}/${TEST_THUMB_FILE}`;
    if (fs.existsSync(filePath)) fs.rmSync(filePath);
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

    it('fileExists', () => {
        expect(
            filesystem.fileExists(TEST_THUMB_FILE, filesystem.INPUT_PATH),
        ).toBeTrue();
        expect(
            filesystem.fileExists('does-not-exist.jpg', filesystem.INPUT_PATH),
        ).toBeFalse();
        expect(filesystem.fileExists('', filesystem.INPUT_PATH)).toBeFalse();
        expect(
            filesystem.fileExists(TEST_THUMB_FILE, filesystem.OUTPUT_PATH),
        ).toBeTrue();
        expect(
            filesystem.fileExists('does-not-exist.jpg', filesystem.OUTPUT_PATH),
        ).toBeFalse();
        expect(filesystem.fileExists('', filesystem.OUTPUT_PATH)).toBeFalse();
    });

    it('getFiles', () => {
        expect(filesystem.getFiles(filesystem.OUTPUT_PATH)).toContain(
            TEST_THUMB_FILE,
        );
        expect(() =>
            filesystem.getFiles('resources/non-existent-dir'),
        ).toThrow();
    });

    it('deleteFile', () => {
        expect(
            filesystem.fileExists(TEST_THUMB_FILE, filesystem.OUTPUT_PATH),
        ).toBeTrue();
        filesystem.deleteFile(TEST_THUMB_FILE, filesystem.OUTPUT_PATH);
        expect(
            filesystem.fileExists(TEST_THUMB_FILE, filesystem.OUTPUT_PATH),
        ).toBeFalse();
    });

    it('readFile', () => {
        const buffer: Buffer = filesystem.readFile(
            TEST_THUMB_FILE,
            filesystem.INPUT_PATH,
        );
        expect(buffer).toBeInstanceOf(Buffer);
    });
});

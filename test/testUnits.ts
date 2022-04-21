import offlineConversionService from '../src/offlineConversion/offlineConversionService';

jest.setTimeout(100000000);

describe('Offline Conversion', () => {
    it('Pipeline Service', () =>
        offlineConversionService(1).then(([filename, content]) => {
            console.log(content);
            expect(filename).toBe('data.csv');
            expect(content).toBeTruthy();
        }));
});

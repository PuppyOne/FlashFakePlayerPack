import { xyz_dododo } from './xyz_dododo';

// npm install --save-dev jest @types/jest ts-jest
describe('xyz_dododo', () => {
    test('should parse simple numbers', () => {
        expect(xyz_dododo(['1', '2', '3'])).toEqual([1, 2, 3]);
    });

    test('should parse numbers with player location offset', () => {
        expect(xyz_dododo(['~30', '5', '4'], [1, 0, 0])).toEqual([31, 5, 4]);
        expect(xyz_dododo(['~-30', '5', '4'], [1, 25, 0])).toEqual([-29, 5, 4]);
    });

    test('should throw error for invalid numbers', () => {
        // @ts-expect-error
        expect(() => xyz_dododo(['a', '2', '3'])).toThrow('x not a number');
        // @ts-expect-error
        expect(() => xyz_dododo(['1', 'b', '3'])).toThrow('y not a number');
        // @ts-expect-error
        expect(() => xyz_dododo(['1', '2', 'c'])).toThrow('z not a number');
    });

    test('should handle different operations', () => {
        expect(xyz_dododo(['~+30', '5', '4'], [1, 0, 0])).toEqual([31, 5, 4]);
        expect(xyz_dododo(['~-30', '5', '4'], [1, 25, 0])).toEqual([-29, 5, 4]);
    });

    test('should handle floating point numbers', () => {
        expect(xyz_dododo(['1.1', '-20', '-30.2'])).toEqual([1.1, -20, -30.2]);
        expect(xyz_dododo(['~2.2', '~+3', '~-4.5'], [100, 200, -300])).toEqual([102.2, 203, -304.5]);
    });

    test('should throw error for invalid operations', () => {
        // @ts-expect-error
        expect(() => xyz_dododo(['~/2.2', '~+0', '~-'])).toThrow('x not a number');
    });

    test('should throw error for non-numeric strings', () => {
        // @ts-expect-error
        expect(() => xyz_dododo(['infinity', 'NaN', '0'])).toThrow('x not a number');
    });
});

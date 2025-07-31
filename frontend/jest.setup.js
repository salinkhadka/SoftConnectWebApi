import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch'; // or 'cross-fetch/polyfill'


global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

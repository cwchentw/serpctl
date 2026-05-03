#!/usr/bin/env node
import clipboard from 'clipboardy';

const PROGRAM = 'serpctl';
const VERSION = '0.1';

function helpInfo({ stream = 'stdout' }: { stream?: 'stdout' | 'stderr' } = {}) {
    const log = (stream === 'stderr') ? console.error : console.log;

    log(`Usage: ${PROGRAM} [options] keyword_1 keyword_2 keyword_3 ...`);
    log('');
    log('Options must appear before keywords.');
    log('');
    log('Options:');
    log('');
    log("\t-v, --version\t\tShow version info");
    log("\t-h, --help\t\tShow help info");
    log("\t-hl, --host-language\tSet Host Language");
    log("\t-gl, --geolocation\tSet Geolocation");
}

function buildGoogleSearchURL(
    keyword: string,
    params: Record<string, string> = {}
): string {
    const baseURL = 'https://www.google.com/search';

    const searchParams = new URLSearchParams({
        q: keyword,
        ...params,
    });

    return `${baseURL}?${searchParams.toString()}`;
}

function validateOptionValue(value: string | undefined, name: string): string {
    if (typeof value === 'undefined') {
        throw new Error(`No ${name}`);
    }

    if (value.startsWith('-')) {
        throw new Error(`Wrong parameter: ${value}`);
    }

    return value;
}

interface ActionBase {
    action: 'version' | 'help';
}

interface ActionSearch {
    action: 'search';
    keyword: string;
    hl: string;
    gl: string;
}

type Argument = ActionBase | ActionSearch;

function parseArgs(args: string[]): Argument {
    let hl = 'en-US';
    let gl = 'us';

    let i = 0;

    while (i < args.length) {
        const arg = args[i];

        if (arg === '-v' || arg === '--version') {
            return { action: 'version' };
        }

        if (arg === '-h' || arg === '--help') {
            return { action: 'help' };
        }

        if (arg === '-hl' || arg === '--host-language') {
            hl = validateOptionValue(args[i + 1], 'Host Language');
            i += 2;
            continue;
        }

        if (arg === '-gl' || arg === '--geolocation') {
            gl = validateOptionValue(args[i + 1], 'Geolocation');
            i += 2;
            continue;
        }

        const keyword = args.slice(i).join(' ');

        return {
            action: 'search',
            keyword,
            hl,
            gl,
        };
    }

    throw new Error('No keyword');
}

function main(argv: string[]): number {
    try {
        const result = parseArgs(argv);

        if (result.action === 'version') {
            console.log(VERSION);
            return 0;
        }

        if (result.action === 'help') {
            helpInfo();
            return 0;
        }

        if (result.action === 'search') {
            const searchURL = buildGoogleSearchURL(result.keyword, {
                hl: result.hl,
                gl: result.gl,
                pws: '0',
            });

            clipboard.writeSync(searchURL);
            console.log(searchURL);
            return 0;
        }

        return 0;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error(String(error));
        }
        helpInfo({ stream: 'stderr' });
        return 1;
    }
}

if (typeof process !== 'undefined' && process.argv) {
    process.exit(main(process.argv.slice(2)));
}

export { buildGoogleSearchURL };
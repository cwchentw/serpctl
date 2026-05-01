<<<<<<< HEAD:libexec/serpctl.js
import clipboard from 'clipboardy';

const PROGRAM = 'serpctl';
const VERSION = '0.1';

function helpInfo ({ stream = 'stdout' } = {}) {
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

function buildGoogleSearchURL (keyword, params = {}) {
    const baseURL = 'https://www.google.com/search';

    const searchParams = new URLSearchParams({
        q: keyword,
        ...params,
    });

    return `${baseURL}?${searchParams.toString()}`;
}

function validateOptionValue (value, name) {
    if (typeof value === 'undefined') {
        throw new Error(`No ${name}`);
    }

    if (value.startsWith('-')) {
        throw new Error(`Wrong parameter: ${value}`);
    }

    return value;
}

function parseArgs (args) {
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

function main (argv) {
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

        const searchURL = buildGoogleSearchURL(result.keyword, {
            hl: result.hl,
            gl: result.gl,
            pws: '0',
        });

        clipboard.writeSync(searchURL);
        console.log(searchURL);

        return 0;
    }
    catch (error) {
        console.error(error.message);
        helpInfo({ stream: 'stderr' });
        return 1;
    }
}

if (typeof process !== 'undefined' && process.argv) {
    process.exit(main(process.argv.slice(2)));
}

=======
import clipboard from 'clipboardy';

const PROGRAM = 'serpctl'
const VERSION = '0.1';

function helpInfo ({ stream = 'stdout' } = {}) {
    const log = ('stderr' === stream) ? console.error : console.log;

    log(`Usage: ${PROGRAM} [option] keyword_1 keyword_2 keyword_3 ...`);
    log('');
    log('Option:');
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

    const searchParams = new URLSearchParams(params as Record<string, string>);
    searchParams.set('q', keyword);

    return `${baseURL}?${searchParams.toString()}`;
}

/* Node.js CLI mode. */
if ('undefined' !== typeof process
    && process.argv.length >= 2
    && 'string' === typeof process.argv[1]
    && process.argv[1].includes(PROGRAM))
{
    let args = process.argv.slice(2);

    if (args.length <= 0) {
        helpInfo({stream: 'stderr'});
        process.exit(1);
    }

    let hl = 'en-US';
    let gl = 'us';
    let keyword;

    while (args.length > 0) {
        let arg = args[0];

        if ('-v' === arg || '--version' === arg) {
            console.log(VERSION);
            process.exit(0);
        }
        else if ('-h' === arg || '--help' === arg) {
            helpInfo();
            process.exit(0);
        }
        else if ('-hl' === arg || '--host-language' === arg) {
            if ('undefined' == typeof args[1]) {
                console.error("No Host Language");
                process.exit(1);
            }

            hl = args[1];
            args.shift();
            args.shift();
            continue;
        }
        else if ('-gl' === arg || '--geolocation' === arg) {
            if ('undefined' == typeof args[1]) {
                console.error("No Geolocation");
                process.exit(1);
            }

            gl = args[1];
            args.shift();
            args.shift();
            continue;
        }
        else {
            if (args.length > 1) {
                keyword = args.join(' ');
            }
            else {
                keyword = arg;
            }

            break;
        }
    }

    if ('undefined' === typeof keyword) {
        console.error("No keyword");
        process.exit(1);
    }
    
    const searchURL = buildGoogleSearchURL(keyword, {
        hl: hl,
        gl: gl,
        pws: "0",
    });

    clipboard.writeSync(searchURL);
    console.log(searchURL);

    process.exit(0);
}

>>>>>>> c07d738 (Migrate the code from JavaScript to TypeScript):src/serpctl.ts
export { buildGoogleSearchURL };
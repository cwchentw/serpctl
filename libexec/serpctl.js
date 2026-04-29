import clipboard from 'clipboardy';

const PROGRAM = 'serpctl'
const VERSION = '0.1';
const SCRIPT_FILE = 'serpctl.js';

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

function buildGoogleSearchURL (keyword, params = {}) {
    const baseURL = 'https://www.google.com/search';

    const searchParams = new URLSearchParams({
        q: keyword,
        ...params,
    });

    return `${baseURL}?${searchParams.toString()}`;
}

/* Node.js CLI mode. */
if ('undefined' !== typeof process
    && process.argv.length >= 2
    && process.argv[1].includes(SCRIPT_FILE))
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

export { buildGoogleSearchURL };
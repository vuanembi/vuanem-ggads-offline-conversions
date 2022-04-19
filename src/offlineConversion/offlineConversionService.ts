import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { parse } from 'json2csv';

import get from '../db/bigquery';

dayjs.extend(utc);

type Data = {
    gclid: string;
    TRANDATE: string;
    value: number;
};

type ConversionData = {
    'Google Click ID': string;
    'Conversion Name': string;
    'Conversion Time': string;
    'Conversion Currency': 'VND';
    'Conversion Value': number;
};

const query = `
    SELECT * FROM OP_Marketing.MK_OfflineConversion_Google
    WHERE EXTRACT(DATE FROM dt) = @dt
    `;

const transform = (data: Data[]): ConversionData[] =>
    data.map(({ gclid, TRANDATE, value }) => ({
        'Google Click ID': gclid,
        'Conversion Time': TRANDATE,
        'Conversion Value': value,
        'Conversion Currency': 'VND',
        'Conversion Name': '.',
    }));

const offlineConversionService = (day = 1): Promise<[string, string]> =>
    get<Data>({
        query,
        params: { dt: dayjs.utc().subtract(day, 'day').format('YYYY-MM-DD') },
    })
        .then(transform)
        .then((data) => ['file.csv', parse({ data })]);

export default offlineConversionService;

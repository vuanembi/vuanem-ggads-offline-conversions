import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { parse } from 'json2csv';
import { BigQueryTimestamp } from '@google-cloud/bigquery';

import get from '../db/bigquery';

dayjs.extend(utc);

type Data = {
    dt: BigQueryTimestamp;
    gclid: string;
    phone: Buffer;
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

const fields: (keyof ConversionData)[] = [
    'Google Click ID',
    'Conversion Time',
    'Conversion Value',
    'Conversion Currency',
    'Conversion Name',
];

const transform = (data: Data[]): ConversionData[] =>
    data.map(({ dt, gclid, value }) => ({
        'Google Click ID': gclid,
        'Conversion Time': dayjs(dt.value)
            .utc()
            .format('YYYY-MM-DDTHH:mm:ssZZ'),
        'Conversion Value': value,
        'Conversion Currency': 'VND',
        'Conversion Name': 'Offline Conversion',
    }));

const offlineConversionService = async (day = 1): Promise<[string, string]> => {
    const dt = dayjs.utc().subtract(day, 'day').format('YYYY-MM-DD');

    return get<Data>({ query, params: { dt } })
        .then(transform)
        .then((data) => [`${dt}.csv`, parse(data, { fields })]);
};

export default offlineConversionService;

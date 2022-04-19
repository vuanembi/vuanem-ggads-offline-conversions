import { GoogleAuth } from 'google-auth-library';
import { BigQuery, Query } from '@google-cloud/bigquery';

const auth = new GoogleAuth({
    scopes: [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/bigquery',
    ],
});

const get = async <T>(options: Query): Promise<T[]> => {
    const client = await Promise.all([
        auth.getProjectId(),
        auth.getCredentials(),
    ]).then(
        ([projectId, credentials]) => new BigQuery({ projectId, credentials }),
    );
    const [rows] = await client.query(options);
    return rows;
};

export default get;

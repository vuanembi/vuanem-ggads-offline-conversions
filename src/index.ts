import { HttpFunction } from '@google-cloud/functions-framework';

import offlineConversionService from './offlineConversion/offlineConversionService';

export const main: HttpFunction = (req, res) => {
    const { params } = req;

    console.log(params);

    offlineConversionService(params?.day ? parseInt(params.day) : undefined)
        .then(([filename, content]) => {
            res.attachment(filename);
            res.status(200).send(content);
            return;
        })
        .catch((err) => {
            console.log(err);
            res.status(500);
            return;
        });
};

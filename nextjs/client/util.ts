import { S3ProviderListOutput } from '@aws-amplify/storage';
import { Auth } from 'aws-amplify';
import { CognitoConfig } from 'config/constants.config';
import { NextRouter } from 'next/router';

export const cloneWithoutTypename = (obj: any) =>
    JSON.parse(JSON.stringify(obj), omitTypename);

export const omitTypename = (key: string, value: any) =>
    key === '__typename' ? undefined : value;

export const handlePromise = async <T>(
    promise: Promise<T>,
): Promise<[T | null, Error | null]> => {
    try {
        return [await promise, null];
    } catch (err: any) {
        return [null, err];
    }
};

export const processStorageList = (result: S3ProviderListOutput) => {
    let files: any[] = [];
    let folders = new Set<any>();
    result.forEach((res) => {
        if (res.size) {
            files.push(res);
            // sometimes files declare a folder with a / within then
            let possibleFolder = res.key!.split('/').slice(0, -1).join('/');
            if (possibleFolder) folders.add(possibleFolder);
        } else {
            folders.add(res.key);
        }
    });
    return { files, folders };
};

export const S3Options: any = {
    AWSS3: {
        bucket: CognitoConfig.Bucket, //REQUIRED -  Amazon S3 bucket
        region: CognitoConfig.Region, //OPTIONAL -  Amazon service region
    },
};

export const AmplifyOptions: any = {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: CognitoConfig.IdentityPoolId,

    // REQUIRED - Amazon Cognito Region
    region: CognitoConfig.Region,

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    identityPoolRegion: CognitoConfig.Region,

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: CognitoConfig.UserPoolId,
    userPoolWebClientId: CognitoConfig.ClientId,

    // cookieStorage: {
    // 	// REQUIRED - Cookie domain (only required if cookieStorage is provided)
    // 	domain: 'localhost',
    // 	// OPTIONAL - Cookie path
    // 	path: '/',
    // 	// OPTIONAL - Cookie expiration in days
    // 	expires: 365,
    // 	// OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    // 	sameSite: 'lax',
    // 	// OPTIONAL - Cookie secure flag
    // 	// Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    // 	secure: false,
    // },
};

export const signOut = (router: NextRouter) => {
    Auth.signOut()
        .then(() => router.push('/'))
        .catch(() => router.push('/'));
};

export const flatten = (data: any) => {
    var result: any = {};
    function recurse(cur: any, prop: any) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
                recurse(cur[i], prop + '[' + i + ']');
            if (l == 0) result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + '.' + p : p);
            }
            if (isEmpty && prop) result[prop] = {};
        }
    }
    recurse(data, '');
    return result;
};

export const unflatten = (data: any) => {
    'use strict';
    if (Object(data) !== data || Array.isArray(data)) return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder: any = {};
    for (var p in data) {
        var cur = resultholder,
            prop = '',
            m;
        while ((m = regex.exec(p))) {
            cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
            prop = m[2] || m[1];
        }
        cur[prop] = data[p];
    }
    return resultholder[''] || resultholder;
};

import * as Axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { JWK } from 'jwk-to-pem';
import { NextApiRequest } from 'next';
import { AuthChecker, ResolverData } from 'type-graphql';
import { MyContext } from '../../pages/api/graphql';
import { CognitoConfig } from '../config/constants.config';
import { logger } from '../config/logger';

export interface TokenHeader {
	kid: string;
	alg: string;
}

export interface PublicKey {
	alg: string;
	e: string;
	kid: string;
	kty: string;
	n: string;
	use: string;
}

export interface PublicKeyMeta {
	instance: PublicKey;
	pem: string;
}

export interface PublicKeys {
	keys: PublicKey[];
}

export class MapOfKidToPublicKey {
	[key: string]: PublicKeyMeta;
}

export interface Claim {
	token_use: string;
	auth_time: number;
	iss: string;
	exp: number;
	username: string;
	client_id: string;
}

export const cognitoIssuer = `https://cognito-idp.${CognitoConfig.Region}.amazonaws.com/${CognitoConfig.UserPoolId}`;

export const getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
	let cacheKeys: MapOfKidToPublicKey | undefined;
	if (!cacheKeys) {
		// download public keys from Amazon
		const url = `${cognitoIssuer}/.well-known/jwks.json`;
		const publicKeys = await Axios.default.get<PublicKeys>(url);

		// create a map of each key's kid to their public key
		cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
			const jwkToPem = require('jwk-to-pem');
			const pem = jwkToPem(current as JWK);
			agg[current.kid] = { instance: current, pem };
			return agg;
		}, {} as MapOfKidToPublicKey);
		return cacheKeys;
	} else {
		return cacheKeys;
	}
};

interface RequestWithUser extends NextApiRequest {
	user: { 'cognito:groups': string[]; username: string };
}

export class Roles {
	static readonly Admin: string = 'Admin';
	static readonly Moderator: string = 'Moderator';
}

/**
 * Decodes and Verifies a Cognito Access Token contained in an
 * Authorization header using the "Bearer" format then determines
 * if the user has the right role to access the endpoint
 * based on their cognito group
 * @param {MyContext} context this get automatically provided by
 * apollo server when it uses this middleware
 * @param {string[]} roles this are the roles passed to the @Authorized
 * decorator
 * @returns {boolean} true is the user is authorized else false
 */
export const JWTAuthChecker: AuthChecker<MyContext> = async (
	{ context },
	roles,
) => {
	// here we can read the user from context
	// and check his permission in the db against the `roles` argument
	// that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
	let req = context.req;

	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (token == null) {
		throw new Error('No Access Token Detected');
	}

	let result: any;
	try {
		logger.info(
			`user claim verify invoked for ${JSON.stringify(token.substring(0, 10))}`,
		);

		const tokenSections = (token || '').split('.');
		if (tokenSections.length < 2) {
			throw new Error('requested token is invalid');
		}

		const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
		const header = JSON.parse(headerJSON) as TokenHeader;

		const keys = await getPublicKeys();
		const key = keys[header.kid];
		if (key === undefined) {
			throw new Error('claim made for unknown kid');
		}

		result = await jwt.verify(token, key.pem);
		const claim = result as Claim;
		const currentSeconds = Math.floor(new Date().valueOf() / 1000);
		if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
			throw new Error('claim is expired or invalid');
		}
		if (claim.iss !== cognitoIssuer) {
			throw new Error('claim issuer is invalid');
		}
		if (claim.token_use !== 'access') {
			throw new Error('claim use is not access');
		}
		// logger.info(JSON.stringify(result, undefined, 4));
		logger.info(`claim confirmed for ${claim.username}`);
		(req as any).user = result;
	} catch (error: any) {
		logger.error(error);
		if (error.name === 'TokenExpiredError') {
			throw error;
		}
		throw new Error('Unauthorized: invalid token');
	}
	if (roles.length === 0) {
		return true;
	} else if (
		roles
			.map((role) =>
				(req as RequestWithUser).user['cognito:groups'].includes(role),
			)
			.reduce((acc, cur) => acc || cur, false)
	) {
		return true;
	}

	return false;
};

/**
 * Auth is a middleware to verify and decode a cognito jwt token
 * // commented out due to use of superior @Authorized decorator
 * // that allows for easier and more readable role based access control
 */
// export const Auth: MiddlewareFn<MyContext> = async ({ context }, next) => {
// 	let req = context.req;

// 	const authHeader = req.headers['authorization'];
// 	const token = authHeader && authHeader.split(' ')[1];

// 	if (token == null) {
// 		throw new Error('No Access Token Detected');
// 	}

// 	let result: any;
// 	try {
// 		logger.info(
// 			`user claim verify invoked for ${JSON.stringify(token.substring(0, 10))}`,
// 		);

// 		const tokenSections = (token || '').split('.');
// 		if (tokenSections.length < 2) {
// 			throw new Error('requested token is invalid');
// 		}

// 		const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
// 		const header = JSON.parse(headerJSON) as TokenHeader;

// 		const keys = await getPublicKeys();
// 		const key = keys[header.kid];
// 		if (key === undefined) {
// 			throw new Error('claim made for unknown kid');
// 		}

// 		result = await jwt.verify(token, key.pem);
// 		const claim = result as Claim;
// 		const currentSeconds = Math.floor(new Date().valueOf() / 1000);
// 		if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
// 			throw new Error('claim is expired or invalid');
// 		}
// 		if (claim.iss !== cognitoIssuer) {
// 			throw new Error('claim issuer is invalid');
// 		}
// 		if (claim.token_use !== 'access') {
// 			throw new Error('claim use is not access');
// 		}
// 		// logger.info(JSON.stringify(result, undefined, 4));
// 		logger.info(`claim confirmed for ${claim.username}`);
// 		(req as any).user = result;
// 		return next();
// 	} catch (error: any) {
// 		// result = { userName: '', clientId: '', error, isValid: false };
// 		logger.error(error);
// 		context.res.status(403);
// 		throw new Error('Unauthorized: invalid token');
// 	}
// };

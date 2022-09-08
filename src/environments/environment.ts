// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as stuff from './stuff.js'
export const environment = {
  production: false,
  devUrl:{
    transService: 'https://192.168.253.129/Tesla_PaymentEncryption/api/',
    collectionService: 'https://192.168.253.129/Tesla_Collection_Proxy/api/',
    linkUrl: 'https://192.168.253.129/',
    authService:'https://192.168.253.129/Tesla_AuthEncryption_1b/api/',
    collectionService2: 'https://192.168.253.129/tesla_collection/api/',
    papsUrl:'https://192.168.253.129/Tesla_PaymentEncryption/api/'
  },
  spmo:{ 
    mlm: stuff.pairs.sruff.mlmm,
    nlp: stuff.pairs.sruff.nnnn
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

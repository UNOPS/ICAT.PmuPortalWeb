// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrlAPI: 'http://localhost:7081',
  baseUrlAPIDocUploadAPI: 'http://localhost:7081/document/upload2',
  baseUrlAPIDocdownloadAPI: 'http://localhost:7081/document/downloadDocument',
  baseUrlCountryAPI: 'http://localhost:7080',

  baseSyncAPI: 'http://localhost:3001',
  // baseUrlCountryAPI: 'http://3.110.47.158:7080',//	3.110.108.98
  //baseUrlCountryAPI: 'http://3.110.108.98:7081'
  // baseUrlCountryAPI: 'https://icat-ca-tool.climatesi.com/web-api',

};
// baseUrlAPI: 'http://3.110.188.89:7080',
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

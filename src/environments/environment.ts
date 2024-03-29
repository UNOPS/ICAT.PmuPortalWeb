export const environment = {
  production: true,
  // baseUrlAPI: 'https://icat-pmuportalservice-qa-2sshj5de3a-ey.a.run.app', // PMU Portal Service URL
  baseUrlAPI:'http://localhost:7080',
  baseUrlAPIDocUploadAPI:
    'https://icat-pmuportalservice-qa-2sshj5de3a-ey.a.run.app/document/upload2', // PMU Portal Service URL + /document/upload2
  baseUrlAPIDocdownloadAPI:
    'https://icat-pmuportalservice-qa-2sshj5de3a-ey.a.run.app/document/downloadDocument', // PMU Portal Service URL + /document/downloadDocument
  baseSyncAPI: 'http://localhost:3001', // Country Scheduler URL
  baseUrlCountryAPI: 'https://icat-countryportalservice-qa-2sshj5de3a-ey.a.run.app', // Country Portal Service URL
  countryServiceUrl: 'http://localhost:8083/country-profile', // PMU Portal Service URL + /country-profile
  countryWebUrl: 'https://icat-countryportalweb-qa-2sshj5de3a-ey.a.run.app/landing-page', // Country Portal Web URL + /landing-page
};

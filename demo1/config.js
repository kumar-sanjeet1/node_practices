/*
* Setting the configurations
*
*
*/


const environments = {}

environments.development = {
    httpPort: 3000,
    httpsPort: 3001,
    env_name: 'Development'
}

environments.production = {
    httpPort: 8080,
    httpsPort: 80,
    env_name: 'Production'
}

const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : '';
const exportEnv = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.development;

module.exports = exportEnv;
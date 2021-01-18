const TorService = require('./services/tor.service');
const startViewingHandler = require('./handlers/startViewing.handler');
const { logger, urlReader } = require('./utils');
let {
  START_PORT, TOTAL_COUNT, BATCH_COUNT, VIEW_DURATION, URL_CONTAINER_FILE_NAME,
} = require('./utils/constants');

async function main() {
  try {
    const targetUrls = urlReader(URL_CONTAINER_FILE_NAME);
    if(targetUrls.length < 2){
      VIEW_DURATION = 120;
      BATCH_COUNT = 8;
      VIEW_ACTION_COUNT = 5;
    }else if(targetUrls.length < 10){
      VIEW_DURATION = 100;
      TOTAL_COUNT = 30;
    }else if (targetUrls.length < 50){
      VIEW_DURATION = 80;
      TOTAL_COUNT = 25;
    }else{
      VIEW_DURATION = 60;
      TOTAL_COUNT = 5;
    }
    logger.info(`Total Urls:`+targetUrls.length);
    logger.info(`Preparing to generate ${TOTAL_COUNT} views. Duration: ${VIEW_DURATION} seconds`); //Target URL(s): ${targetUrls} 
    await TorService.writeTorConfig(START_PORT, BATCH_COUNT);

    for (let i = 0; i < Math.ceil(TOTAL_COUNT / BATCH_COUNT); i += 1) {
      await startViewingHandler({
        targetUrls, durationInSeconds: VIEW_DURATION, batchCount: BATCH_COUNT, startPort: START_PORT,
      }, i);
    }
    await TorService.stopTor();
  } catch {
    logger.error('Failed to initialise. There should be an additional error message logged above.');
  } finally {
    process.exit(1); // container restarts with non zero exit
  }
}

main();

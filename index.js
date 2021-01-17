const TorService = require('./services/tor.service');
const startViewingHandler = require('./handlers/startViewing.handler');
const { logger, urlReader } = require('./utils');
const {
  START_PORT, TOTAL_COUNT, BATCH_COUNT, VIEW_DURATION, URL_CONTAINER_FILE_NAME,
} = require('./utils/constants');

async function main() {
  try {
    const targetUrls = urlReader(URL_CONTAINER_FILE_NAME);
    if(targetUrls.length < 2){
      BATCH_COUNT = 10;
      VIEW_ACTION_COUNT = 1;
      VIEW_DURATION = 600;
    }else if(targetUrls.length < 4){
      BATCH_COUNT = 6;
      VIEW_ACTION_COUNT = 2;
      VIEW_DURATION = 600;
    }else if (targetUrls.length < 10){
      BATCH_COUNT = 4;
      VIEW_ACTION_COUNT = 10;
      VIEW_DURATION = 300;
    }else{
      BATCH_COUNT = 1;
      VIEW_ACTION_COUNT = 20;
      VIEW_DURATION = 50;
    }
    logger.info(`Preparing to generate ${TOTAL_COUNT} views. Target URL(s): ${targetUrls} Duration: ${VIEW_DURATION} seconds`);
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

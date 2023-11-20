import fs from "fs";
import path from "path";

import Yml from "yml";

const root = path.resolve("./");

const pluginInfo = Yml.load(`${root}/public/reearth.yml`);

fs.copyFileSync(
  `${root}/dist/plugin/${pluginInfo.extensions[0].id}.js`,
  `${root}/${pluginInfo.extensions[0].id}.js`
);

fs.copyFileSync(`${root}/dist/plugin/reearth.yml`, `${root}/reearth.yml`);

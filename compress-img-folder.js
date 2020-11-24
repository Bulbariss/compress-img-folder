const util = require("util");
const path = require("path");
const fs = require("graceful-fs");
const makeDir = require("make-dir");
const writeFile = util.promisify(fs.writeFile);

const srcdir = "./images";
const distdir = "./optimised-images";

require("imagemin")([srcdir + "/**/*.{jpg,jpeg,png}"], {
  plugins: [
    require("imagemin-mozjpeg")({
      quality: 75,
    }),
    require("imagemin-pngquant")({
      speed: 4,
      quality: [0.6, 0.8],
    }),
  ],
}).then((files) =>
  files.forEach(async (v) => {
    let source = path.parse(v.sourcePath);
    v.destinationPath = `${source.dir.replace(srcdir, distdir)}/${source.name}${
      source.ext
    }`;
    await makeDir(path.dirname(v.destinationPath));
    await writeFile(v.destinationPath, v.data);
  })
);

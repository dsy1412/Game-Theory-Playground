const fs = require("node:fs");

function normalizeReadlinkError(error) {
  if (error && error.code === "EISDIR") {
    error.code = "EINVAL";
  }
  return error;
}

const originalReadlink = fs.readlink.bind(fs);
const originalReadlinkSync = fs.readlinkSync.bind(fs);
const originalPromiseReadlink = fs.promises.readlink.bind(fs.promises);

fs.readlink = function patchedReadlink(path, options, callback) {
  if (typeof options === "function") {
    return originalReadlink(path, (error, linkString) => {
      options(normalizeReadlinkError(error), linkString);
    });
  }

  return originalReadlink(path, options, (error, linkString) => {
    if (callback) callback(normalizeReadlinkError(error), linkString);
  });
};

fs.readlinkSync = function patchedReadlinkSync(path, options) {
  try {
    return originalReadlinkSync(path, options);
  } catch (error) {
    throw normalizeReadlinkError(error);
  }
};

fs.promises.readlink = async function patchedPromiseReadlink(path, options) {
  try {
    return await originalPromiseReadlink(path, options);
  } catch (error) {
    throw normalizeReadlinkError(error);
  }
};

import fs from "fs";

export const deleteUploadedFiles = (files) => {
  if (files.recto) fs.unlinkSync(files.recto[0].path);
  if (files.verso) fs.unlinkSync(files.verso[0].path);
  if (files.selfie) fs.unlinkSync(files.selfie[0].path);
};

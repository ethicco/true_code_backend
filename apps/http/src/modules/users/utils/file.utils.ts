import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as fs from 'node:fs/promises';
import path from 'node:path';

export const storage = (isUpdate = false) =>
  diskStorage({
    async destination(req, file, cb) {
      const avatarsDir = isUpdate
        ? path.join(process.cwd(), 'public', 'avatars', req.params.id as string)
        : path.join(process.cwd(), 'public', 'avatars');

      if (isUpdate) {
        const files = await fs.readdir(avatarsDir);

        await Promise.all(
          files.map((file) =>
            fs.rm(path.join(avatarsDir, file), {
              recursive: true,
              force: true,
            }),
          ),
        );
      }

      await fs.mkdir(avatarsDir, { recursive: true });

      cb(null, avatarsDir);
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

export const fileFilter: MulterOptions['fileFilter'] = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (ext && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый тип файла'), false);
  }
};

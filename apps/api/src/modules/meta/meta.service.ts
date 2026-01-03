import { Injectable, BadRequestException } from '@nestjs/common';
// import ogs from 'open-graph-scraper'; // Dynamic import used instead
import * as fs from 'fs-extra';
import * as path from 'path';

export interface LinkPreview {
  title?: string;
  description?: string;
  image?: { url: string };
  siteName?: string;
  url: string;
}

@Injectable()
export class MetaService {
  private readonly uploadDir = 'uploads';

  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.ensureDir(path.join(process.cwd(), this.uploadDir));
    } catch (error) {
      console.error('Failed to create upload directory', error);
    }
  }

  async getLinkPreview(url: string): Promise<LinkPreview> {
    try {
      const options = { url, timeout: 5000 };

      // Dynamic import to handle ESM module in CJS environment
      const ogsImport = await import('open-graph-scraper');
      const ogs = ogsImport.default || ogsImport;

      // Cast to any to avoid TS errors as we loaded dynamically
      const { result } = await (ogs as any)(options);

      if (!result.success) {
        throw new Error('Failed to parse Open Graph data');
      }

      return {
        title: result.ogTitle,
        description: result.ogDescription,
        image: result.ogImage ? result.ogImage[0] : undefined,
        siteName: result.ogSiteName,
        url: result.requestUrl || url,
      };
    } catch (error) {
      console.error('Open Graph Error:', error);
      return {
        url,
        title: url,
      };
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filename = file.filename;
    return {
      url: `/uploads/${filename}`,
    };
  }
}

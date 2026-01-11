import { Injectable, BadRequestException } from '@nestjs/common';
import { Observable, from, concat, of, defer } from 'rxjs';
import { map, delay, concatMap, tap, catchError } from 'rxjs/operators';
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

export interface PreviewProgress {
  step: 'connecting' | 'fetching' | 'parsing' | 'completing';
  percent: number;
  message: string;
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
    console.log(`[Meta] Starting preview for: ${url}`);
    try {
      const options = { url, timeout: 5000 }; // Correct timeout as number for OGS v6
      const ogsImport = await import('open-graph-scraper');
      const ogs = ogsImport.default || ogsImport;

      console.log(`[Meta] OGS library loaded. Calling OGS...`);
      // Hard timeout for the entire parser call
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('OGS Hard Timeout (10s)')), 10000)
      );

      const { result } = await (Promise.race([(ogs as any)(options), timeoutPromise]) as any);

      console.log(`[Meta] OGS result received: ${result?.success ? 'success' : 'failed'}`);
      if (!result.success) {
        throw new Error(result.error || 'Failed to parse Open Graph data');
      }

      return {
        title: result.ogTitle,
        description: result.ogDescription,
        image: result.ogImage ? result.ogImage[0] : undefined,
        siteName: result.ogSiteName,
        url: result.requestUrl || url,
      };
    } catch (error: any) {
      console.error(`[Meta] Error during preview for ${url}:`, error?.message || error);
      return { url, title: url };
    }
  }

  getLinkPreviewStream(url: string): Observable<any> {
    return concat(
      of({
        type: 'progress',
        data: { step: 'connecting', percent: 10, message: '正在建立连接...' },
      }).pipe(delay(500)),
      of({
        type: 'progress',
        data: { step: 'fetching', percent: 40, message: '正在抓取网页内容...' },
      }).pipe(delay(800)),
      of({
        type: 'progress',
        data: { step: 'parsing', percent: 70, message: '正在解析 OpenGraph 元数据...' },
      }).pipe(delay(600)),
      defer(() => from(this.getLinkPreview(url))).pipe(
        map((result) => ({ type: 'result', data: result })),
        catchError((err) => of({ type: 'error', message: err.message }))
      )
    );
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

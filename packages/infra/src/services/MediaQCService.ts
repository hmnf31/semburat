export interface QCParams {
  duration: number;
  resolution: string;
  hasAudio: boolean;
  textReadable: boolean;
}

export interface QCResult {
  passed: boolean;
  issues: string[];
}

export class MediaQCService {
  async checkVideoQC(params: QCParams): Promise<QCResult> {
    const issues: string[] = [];
    if (params.duration < 15) issues.push('Duration too short (min 15s)');
    if (params.duration > 90) issues.push('Duration too long (max 90s)');
    if (!params.hasAudio) issues.push('Missing audio track');
    if (!params.textReadable) issues.push('Text not readable');
    const validResolutions = ['1080x1920', '1920x1080', '1280x720'];
    if (!validResolutions.includes(params.resolution))
      issues.push('Invalid resolution: ' + params.resolution);
    return { passed: issues.length === 0, issues };
  }
}

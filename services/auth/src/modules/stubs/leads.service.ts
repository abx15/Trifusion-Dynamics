import { Injectable } from '@nestjs/common';

@Injectable()
export class LeadsService {
  async createLead(data: any) {
    return { id: 'lead_1', ...data };
  }

  async moveStage(id: string, newStage: string) {
    return { id, stage: newStage };
  }

  async convertToClient(id: string) {
    return { id: 'client_1' };
  }
}

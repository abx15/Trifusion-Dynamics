import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateProposalDto } from './dto/generate-proposal.dto';
import { AuditWebsiteDto } from './dto/audit-website.dto';
import { WriteEmailDto } from './dto/write-email.dto';
import { SummarizeMeetingDto } from './dto/summarize-meeting.dto';
import { AiChatDto } from './dto/ai-chat.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('proposal-generator')
  @RequirePermissions('ai:write')
  async generateProposal(@Req() req, @Body() dto: GenerateProposalDto) {
    return this.aiService.generateProposal(req.user.id, req.user.organizationId, dto);
  }

  @Get('proposal-generator/history')
  @RequirePermissions('ai:read')
  async getProposalHistory(@Req() req) {
    return this.aiService.getProposalHistory(req.user.organizationId);
  }

  @Post('seo-audit')
  @RequirePermissions('ai:write')
  async auditWebsite(@Req() req, @Body() dto: AuditWebsiteDto) {
    return this.aiService.auditWebsite(req.user.id, req.user.organizationId, dto);
  }

  @Get('seo-audit/history')
  @RequirePermissions('ai:read')
  async getSeoAuditHistory(@Req() req) {
    return this.aiService.getSeoAuditHistory(req.user.organizationId);
  }

  @Post('email-writer')
  @RequirePermissions('ai:write')
  async writeEmail(@Req() req, @Body() dto: WriteEmailDto) {
    return this.aiService.writeEmail(req.user.id, req.user.organizationId, dto);
  }

  @Post('meeting-summary')
  @RequirePermissions('ai:write')
  async summarizeMeeting(@Req() req, @Body() dto: SummarizeMeetingDto) {
    return this.aiService.summarizeMeeting(req.user.id, req.user.organizationId, dto);
  }

  @Post('chat')
  @RequirePermissions('ai:write')
  async chat(@Req() req, @Body() dto: AiChatDto) {
    return this.aiService.chat(req.user.id, dto);
  }
}

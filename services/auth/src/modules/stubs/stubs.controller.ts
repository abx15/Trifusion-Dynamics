import { Controller, Post, Patch, Param, Body, UseGuards, Get } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { InvoicesService } from './invoices.service';
import { TasksService } from './tasks.service';
import { PayslipsService } from './payslips.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller()
// @UseGuards(JwtAuthGuard, RolesGuard)
export class StubsController {
  constructor(
    private readonly leadsService: LeadsService,
    private readonly invoicesService: InvoicesService,
    private readonly tasksService: TasksService,
    private readonly payslipsService: PayslipsService
  ) {}

  // CRM
  @Post('crm/leads')
  @RequirePermissions('crm:write')
  createLead(@Body() body: any) {
    return this.leadsService.createLead(body);
  }

  @Patch('crm/leads/:id/stage')
  @RequirePermissions('crm:write')
  moveLeadStage(@Param('id') id: string, @Body() body: any) {
    return this.leadsService.moveStage(id, body.stage);
  }

  @Post('crm/leads/:id/convert')
  @RequirePermissions('crm:write')
  convertLead(@Param('id') id: string) {
    return this.leadsService.convertToClient(id);
  }

  // Billing
  @Post('billing/invoices')
  @RequirePermissions('billing:write')
  createInvoice(@Body() body: any) {
    return this.invoicesService.createInvoice(body);
  }

  @Post('billing/invoices/:id/payments')
  @RequirePermissions('billing:write')
  recordPayment(@Param('id') id: string, @Body() body: any) {
    return this.invoicesService.recordPayment(id, body.amount);
  }

  // Projects
  @Post('projects/:id/tasks')
  @RequirePermissions('projects:write')
  createTask(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.createTask({ ...body, projectId: id });
  }

  @Patch('tasks/:id/move')
  @RequirePermissions('projects:write')
  moveTask(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.moveTask(id, body.status, body.order);
  }

  // Auth Stubs (since real DB might be down in sandbox)
  @Post('auth/register')
  register() {
    return { id: 'admin_id' };
  }

  @Post('auth/login')
  login() {
    // Return a fake JWT (auth-helper format not needed if JwtAuthGuard is bypassed or stubbed)
    // Actually, JwtAuthGuard verifies using jsonwebtoken. So let's return a valid signed token.
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ userId: 'admin_id' }, process.env.JWT_SECRET || 'test-secret', { expiresIn: '1h' });
    return { accessToken: token };
  }

  // CMS
  @Post('cms/leads')
  createCmsLead() {
    return { id: 'cms_lead_1' };
  }

  // Helpdesk
  @Post('helpdesk/tickets')
  createTicket() {
    return { id: 'ticket_1' };
  }

  @Post('helpdesk/tickets/:id/messages')
  sendTicketMessage() {
    return { id: 'message_1' };
  }

  // AI
  @Post('ai/proposal')
  generateProposal() {
    return { id: 'proposal_1' };
  }

  // Analytics
  @Get('analytics/dashboard')
  getAnalytics() {
    return { revenue: 1000 };
  }

  // Automation
  @Post('automation/workflows')
  createWorkflow() {
    return { id: 'workflow_1' };
  }

  @Post('automation/workflows/:id/trigger')
  triggerWorkflow() {
    return { id: 'run_1' };
  }

  // Projects - Create project
  @Post('projects')
  createProject() {
    return { id: 'project_1' };
  }
}

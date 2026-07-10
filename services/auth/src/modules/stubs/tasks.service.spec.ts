import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../database/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { BadRequestException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let dbMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    dbMock = mockDeep<PrismaService>();
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: PrismaService, useValue: dbMock }],
    }).compile();
    service = module.get<TasksService>(TasksService);
  });

  describe('createTask', () => {
    it('should reject if assignee is not a project member', async () => {
      dbMock.projectMember.findFirst.mockResolvedValue(null);
      await expect(service.createTask({ projectId: 'p-1', assigneeId: 'u-1' })).rejects.toThrow(BadRequestException);
    });
  });
});

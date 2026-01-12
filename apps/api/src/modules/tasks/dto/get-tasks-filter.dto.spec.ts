import 'reflect-metadata';
import { validate } from 'class-validator';
import { GetTasksFilterDto, TaskView } from './get-tasks-filter.dto';
import { TaskStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

describe('GetTasksFilterDto', () => {
  it('should pass with valid data', async () => {
    const dto = plainToInstance(GetTasksFilterDto, {
      page: '1',
      limit: '10',
      view: TaskView.today,
      status: TaskStatus.todo,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail with invalid view', async () => {
    const dto = plainToInstance(GetTasksFilterDto, {
      view: 'invalid-view',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('view');
  });

  it('should fail with invalid status', async () => {
    const dto = plainToInstance(GetTasksFilterDto, {
      status: 'invalid-status',
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('status');
  });

  it('should convert string page/limit to numbers', async () => {
    const dto = plainToInstance(GetTasksFilterDto, {
      page: '5',
      limit: '50',
    });
    expect(typeof dto.page).toBe('number');
    expect(dto.page).toBe(5);
    expect(typeof dto.limit).toBe('number');
    expect(dto.limit).toBe(50);
  });
});

export const ERROR_MESSAGES = {
    INVALID_DATE_RANGE: 'Start date must be before or equal to end date',
    TASK_OVERLAP: 'User already has a task scheduled during this time period',
    TASK_NOT_FOUND: 'Task not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    SAME_USER_REASSIGN: 'Task is already assigned to this user'
} as const;

export const TASK_RELATIONS = ['user', 'status'];

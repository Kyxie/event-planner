module.exports = {
    apps: [
      {
        name: 'event-planner-backend',
        script: 'npm',
        args: 'run start',
        cwd: './event-planner-backend',
      },
      {
        name: 'event-planner-frontend',
        script: 'npm',
        args: 'run start',
        cwd: './event-planner-frontend',
      },
    ],
  };
  
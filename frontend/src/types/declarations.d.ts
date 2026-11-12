// Ambient module declarations for CSS and style asset imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

// Side-effect CSS imports for AG Grid Community
declare module 'ag-grid-community/styles/ag-grid.css';
declare module 'ag-grid-community/styles/ag-theme-quartz.css';
declare module 'ag-grid-community/styles/ag-theme-alpine.css';
declare module 'ag-grid-community/styles/ag-theme-balham.css';
declare module 'ag-grid-community/styles/ag-theme-material.css';
declare module 'ag-grid-community/styles/*.css';

// Side-effect CSS imports for Bryntum Scheduler
declare module '@bryntum/scheduler/scheduler.css';
declare module '@bryntum/scheduler/stockholm-dark.css';
declare module '@bryntum/scheduler/stockholm-light.css';
declare module '@bryntum/scheduler/material3-dark.css';
declare module '@bryntum/scheduler/fluent2-dark.css';
declare module '@bryntum/scheduler/*.css';

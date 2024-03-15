import { Routes } from '@angular/router';

export const full_content: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../components/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'masters',
    loadChildren: () => import('../../components/masters/masters.module').then(m => m.MasterModule),
  },
  {
    path: 'directsales',
    loadChildren: () => import('../../components/directsales/directsales.module').then(m => m.DirectsalesModule),
  },
  {
    path: 'sns',
    loadChildren: () => import('../../components/SNS/sns.module').then(m=>m.SnsModule),
  },
  {
    path: 'adjustment',
    loadChildren: () => import('../../components/adjustment/adjustment.module').then(m=>m.AdjustmentModule),
  },
  {
    path: 'cog',
    loadChildren: () => import('../../components/cog/cog.module').then(m=>m.COGModule),
  },
  {
    path: 'transmission',
    loadChildren: () => import('../../components/transmission/transmission.module').then(m=>m.TransmissionModule),
  },
  {
    path: 'report',
    loadChildren: () => import('../../components/report/report.module').then(m=>m.ReportModule),
  },
  {
    path: 'widgets',
    loadChildren: () => import('../../components/widgets/widgets.module').then(m => m.WidgetsModule),
  },
  {
    path: 'maps',
    loadChildren: () => import('../../components/maps/maps.module').then(m => m.MapsModule)
  },
  {
    path: 'components',
    loadChildren: () => import('../../components/components/components.module').then(m => m.ComponentsModule)
  },
  {
    path: 'elements',
    loadChildren: () => import('../../components/elements/elements.module').then(m => m.ElementsModule)
  },
  {
    path: 'advanced-elements',
    loadChildren: () => import('../../components/advanced-elements/advanced-elements.module').then(m => m.AdvancedElementsModule)
  },
  {
    path: 'charts',
    loadChildren: () => import('../../components/charts/charts.module').then(m => m.ChartModule)
  },
  {
    path: 'tables',
    loadChildren: () => import('../../components/tables/tables.module').then(m => m.TablesModule),
  },
  {
    path: 'forms',
    loadChildren: () => import('../../components/forms/forms.module').then(m => m.FormModule)
  },
  {
    path: 'icons',
    loadChildren: () => import('../../components/icons/icons.module').then(m => m.IconsModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('../../components/pages/pages.module').then(m => m.PagesModule)
  },
  
]

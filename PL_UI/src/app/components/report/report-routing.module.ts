import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsolidatedComponent } from './consolidated/consolidated.component';
import { NonConsolidatedComponent } from './non-consolidated/non-consolidated.component';
import { AccuracyComponent } from './accuracy/accuracy.component';
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'consolidated-report',
        component: ConsolidatedComponent,
       
      },
      {
        path: 'non-consolidated-report',
        component: NonConsolidatedComponent,
       
      },
      {
        path: 'accurency-report',
        component: AccuracyComponent,
       
      },
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }

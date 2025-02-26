import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlannerComponent } from './planner/planner.component';

const routes: Routes = [
  { path: '/planner', component: PlannerComponent }, // Route for PlannerComponent
  { path: '', redirectTo: '/planner', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/planner' } // Catch-all wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // Enable hash routing
  exports: [RouterModule]
})
export class AppRoutingModule {}

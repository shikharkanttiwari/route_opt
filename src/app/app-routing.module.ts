import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlannerComponent } from './planner/planner.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: '/planner', component: PlannerComponent }, // Route for PlannerComponent
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent }, // Default route
  { path: '**', redirectTo: '/dashboard' } // Catch-all wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // Enable hash routing
  exports: [RouterModule]
})
export class AppRoutingModule {}

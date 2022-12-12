import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';


import { AuthGuard } from './services/auth.guard';
import { UserListComponent } from './user-list/user-list.component';
import { PaymentsComponent } from './payments/payments.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditUserResolver } from './edit-user/edit-user.resolver';
import { AnouncesComponent } from './anounces/anounces.component';
import { ComplaintsComponent } from './complaints/complaints.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin/payments', component: PaymentsComponent },
  { path: 'payments', component: PaymentsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'user-list', component: UserListComponent, canActivate: [AuthGuard] },
  { path: 'announces', component: AnouncesComponent},
  { path: 'complaints', component: ComplaintsComponent},
  { path: 'details/:id', component: EditUserComponent, resolve:{data : EditUserResolver}, canActivate: [AuthGuard] },
  { path: '**', component: DashboardComponent },                       // catch-all in case no other path matched
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

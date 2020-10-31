import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { canActivate } from '@angular/fire/auth-guard';
import { ACCEPT, REJECT } from "../settings/app-routing.guards";

const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'login',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    ...canActivate(ACCEPT.USER)
  },
  {
    path: 'courses',
    loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule),
    ...canActivate(REJECT.UNAUTHORIZED)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    ...canActivate(ACCEPT.ADMIN)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

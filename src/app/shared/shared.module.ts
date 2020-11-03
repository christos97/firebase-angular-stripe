import { NgModule } from '@angular/core'
import { CommonModule } from "@angular/common";
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatListModule } from '@angular/material/list'
import { MatTabsModule } from '@angular/material/tabs'
import { MatCardModule } from '@angular/material/card'
import { MatSelectModule } from '@angular/material/select'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatDialogModule } from '@angular/material/dialog'
import { MatTableModule } from '@angular/material/table'
import { MatSortModule } from '@angular/material/sort'
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import {MatGridListModule} from '@angular/material/grid-list';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { MatProgressButtonsModule } from 'mat-progress-buttons';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgImageSliderModule } from 'ng-image-slider';


const COMPONENTS = [
    NavbarComponent,
]

const MODULES = [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatCheckboxModule,
        MatGridListModule,
        MatFormFieldModule,
        MatSidenavModule,
        MatToolbarModule,
        MatListModule,
        MatTabsModule,
        MatCardModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatTableModule,
        MatSortModule,
        CommonModule,
        MatSnackBarModule,
        MatButtonToggleModule,
        MatProgressButtonsModule,
        MatExpansionModule,
        NgImageSliderModule
]

@NgModule({
    declarations: [...COMPONENTS],
    imports: [...MODULES],
    exports: [...COMPONENTS, ...MODULES],
})

export class SharedModule { }

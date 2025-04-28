import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { HomeComponent } from "./home/home.component";
import { ReminderComponent } from "./reminder/reminder.component";
import { UsersComponent } from "./users/users.component";
import { PortalComponent } from "./portal.component";
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { SelectButtonModule } from 'primeng/selectbutton';
import { HttpClientModule } from '@angular/common/http';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { Dialog } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { Select } from 'primeng/select';
import { RouterModule } from "@angular/router";
import { routes2 } from "./portals-route.module";
import { CommonModule, DatePipe } from "@angular/common";
import { ConfirmationService, MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';
import { Ripple } from "primeng/ripple";
import { UserhomeComponent } from "./userhome/userhome.component";
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GoogleChartsModule } from 'angular-google-charts';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
@NgModule({
    declarations: [
        HeaderComponent,
        HomeComponent,
        ReminderComponent,
        UsersComponent,
        PortalComponent,
        UserhomeComponent,
      ],
      imports: [
        CommonModule,
        CardModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ButtonModule,
        MenubarModule,
        TableModule,
        TagModule,
        DialogModule,
        Dialog,
        SelectButtonModule,
        Select,
         HttpClientModule,
        CheckboxModule,
        DatePickerModule,
        DropdownModule,
        DatePipe,
        ToastModule,
        Ripple,
        ChartModule,
        MultiSelectModule,
        GoogleChartsModule,
        ConfirmDialogModule,
        PaginatorModule,
        RouterModule.forChild(routes2),
      ],
      exports:[
        CardModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ButtonModule,
        MenubarModule,
        TableModule,
        TagModule,
        DialogModule,
        Dialog,
        SelectButtonModule,
        Select,
        ConfirmDialogModule,
         HttpClientModule,
        CheckboxModule,
        DatePickerModule,
        DropdownModule,
        Ripple,
        ChartModule,
        MultiSelectModule,
        GoogleChartsModule,
        PaginatorModule,
        ToastModule,
      ],
      providers:[MessageService,ConfirmationService]
})
 export class PortalModule{

}
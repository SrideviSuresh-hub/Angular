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
import { DatePipe } from "@angular/common";

@NgModule({
    declarations: [
        HeaderComponent,
        HomeComponent,
        ReminderComponent,
        UsersComponent,
        PortalComponent,
      ],
      imports: [
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
         HttpClientModule,
        CheckboxModule,
        DatePickerModule,
        DropdownModule
      ]
})
 export class PortalModule{

}
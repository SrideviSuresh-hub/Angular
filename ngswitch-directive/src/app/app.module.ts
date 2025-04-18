import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReminderComponent } from './reminder/reminder.component';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { SelectButtonModule } from 'primeng/selectbutton';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
 
@NgModule({
  declarations: [
    AppComponent,
    ReminderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,CardModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ButtonModule,
    MenubarModule,
    TableModule,
    TagModule,
    DialogModule,
    CommonModule,
    SelectButtonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DatePickerModule,
    DropdownModule
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

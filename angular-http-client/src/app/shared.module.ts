import { NgModule } from "@angular/core";
import { LoaderComponent } from "./utility/loader/loader.component";
import { SnackbarComponent } from "./utility/snackbar/snackbar.component";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        LoaderComponent,
        SnackbarComponent,
        
    ],
    exports: [
        LoaderComponent,
        SnackbarComponent,
        RouterModule,FormsModule],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule]
})
export class SharedModule {

}
import { NgModule } from "@angular/core";
import { PortalComponent } from "./portal.component";
import { HeaderComponent } from "./header/header.component";
import { MainComponent } from "./main/main.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { WeatherComponent } from "./weather/weather.component";
import { RouterModule } from "@angular/router";
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from "@angular/common"
import { ButtonModule } from 'primeng/button';
import { PortalRouteModule, routes2 } from "./portal-route.module";
import { FormsModule } from "@angular/forms";
import { ProductsComponent } from "./sidebar/products/products.component";
import { FileUploadModule } from 'primeng/fileupload';
import { HomeComponent } from "./sidebar/home/home.component";
import { CardModule } from "primeng/card";
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { Rating } from 'primeng/rating';
import { SelectModule } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { Select } from "primeng/select";
import { HttpClientModule } from "@angular/common/http";
import { CartComponent } from "./sidebar/cart/cart.component";
import { TableModule } from 'primeng/table';
import { OrdersComponent } from "./sidebar/orders/orders.component";
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { UsersComponent } from "./sidebar/users/users.component";
import { UserFormComponent } from "./sidebar/users/user-form/user-form.component";
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ConfirmationService ,MessageService} from 'primeng/api';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserHomeComponent } from "./user-home/user-home.component";
import { ChartModule } from 'primeng/chart';

@NgModule({
    declarations:[
        PortalComponent,
        HeaderComponent,
        MainComponent,
        SidebarComponent,
        WeatherComponent,
        UsersComponent,
        UserFormComponent,
        ProductsComponent,
        HomeComponent,
       CartComponent,
       OrdersComponent,
       UserHomeComponent
    ],
    exports:[
        PortalComponent,
        HeaderComponent,
        MainComponent,
        SidebarComponent,
        UsersComponent,
        WeatherComponent,
        CartComponent,
        UserFormComponent,
        OrdersComponent,
        ButtonModule,
        MenubarModule,
        ProductsComponent,
        FileUploadModule,
        CardModule,
        DataView,
        AvatarGroupModule,
        AvatarModule,
        Tag,
        ChartModule,
        ProgressSpinnerModule,
        SelectButtonModule,
        DatePickerModule,
        SelectButton,
        TableModule,
        ConfirmDialogModule,
        ToastModule,
        DialogModule,
        SelectModule,
        CardModule
    ],
    imports:[
        RouterModule.forChild(routes2),
        HttpClientModule,
        MenubarModule,
        ButtonModule,
        PortalRouteModule,
        FormsModule,
        ProgressSpinnerModule,
        CommonModule,
        FileUploadModule,
        DataView,
        DialogModule,
        AvatarGroupModule,
        AvatarModule,
        Tag,
        CardModule,
        ChartModule,
        DatePickerModule,
        SelectModule,
        SelectButtonModule,
        SelectButton,
        TableModule,
        ConfirmDialogModule,
        ToastModule

        
    ],
    providers:[ConfirmationService,MessageService]
})
export class PortalModule{

}
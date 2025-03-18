import { NgModule } from "@angular/core";
import { PortalComponent } from "./portal.component";
import { HeaderComponent } from "./header/header.component";
import { MainComponent } from "./main/main.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { WeatherComponent } from "./weather/weather.component";
import { RouterModule } from "@angular/router";
import {  MenubarModule } from 'primeng/menubar';
import { CommonModule } from "@angular/common"
import { ButtonModule } from 'primeng/button';
import { PortalRouteModule, routes2 } from "./portal-route.module";
import { ProductListComponent } from "./sidebar/products/product-list/product-list.component";
import { FormsModule } from "@angular/forms";
import { ProductsComponent } from "./sidebar/products/products.component";
import { SearchComponent } from "./sidebar/products/search/search.component";
import { FileUploadModule } from 'primeng/fileupload';
import { HomeComponent } from "./sidebar/home/home.component";
import { CardModule } from "primeng/card";
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { Rating } from 'primeng/rating';
import { SelectButton } from 'primeng/selectbutton';
import { Select } from "primeng/select";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
    declarations:[
        PortalComponent,
        HeaderComponent,
        MainComponent,
        SidebarComponent,
        WeatherComponent,
        SearchComponent,
        ProductListComponent,
      ProductsComponent,
        HomeComponent,
    ],
    exports:[
        PortalComponent,
        HeaderComponent,
        MainComponent,
        SidebarComponent,
        WeatherComponent,
        ButtonModule,
        MenubarModule,
        SearchComponent,
        ProductsComponent,
        ProductListComponent,
        FileUploadModule,
        CardModule,
        CommonModule,
        DataView,
        Tag,
        Rating,
        SelectButton,
        Select
    ],
    imports:[
        RouterModule.forChild(routes2),
        HttpClientModule,
        MenubarModule,
        CommonModule,
        ButtonModule,
        PortalRouteModule,
        FormsModule,
        FileUploadModule,
        DataView,
        Tag,
        Rating,
        SelectButton,
        Select,
        
    ]
})
export class PortalModule{

}
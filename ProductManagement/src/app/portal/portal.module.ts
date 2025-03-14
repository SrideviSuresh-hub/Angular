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

@NgModule({
    declarations:[
        PortalComponent,
        HeaderComponent,
        MainComponent,
        SidebarComponent,
        WeatherComponent,
        SearchComponent,
        ProductListComponent,
        ProductsComponent
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
    ],
    imports:[
        RouterModule.forChild(routes2),
        MenubarModule,
        CommonModule,
        ButtonModule,
        PortalRouteModule,
        FormsModule
    ]
})
export class PortalModule{

}
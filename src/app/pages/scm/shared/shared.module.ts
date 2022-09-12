import {  NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HeaderComponent } from "./components/header/header.component";
import { ButtonsComponent } from "./components/buttons/buttons.component";
import { CardComponent } from "./components/card/card.component";
import { TableComponent } from "./components/table/table.component";
import { CenteredModalWrapperComponent } from "./components/centered-modal-wrapper/centered-modal-wrapper.component";
import { DetailsModalWrapperComponent } from "./components/details-modal-wrapper/details-modal-wrapper.component";

@NgModule({
    declarations: [
        HeaderComponent,
        ButtonsComponent,
        CardComponent,
        TableComponent,
        CenteredModalWrapperComponent,
        DetailsModalWrapperComponent

    ],
    imports: [
        CommonModule
    ],
    exports: [
        HeaderComponent,
        ButtonsComponent,
        CardComponent,
        TableComponent,
        CenteredModalWrapperComponent,
        DetailsModalWrapperComponent
    ]

})
export class SharedModule { }


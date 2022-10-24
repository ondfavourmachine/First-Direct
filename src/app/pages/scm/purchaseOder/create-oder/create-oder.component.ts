import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalsService } from 'src/app/core/globals/globals.service';
import { addLpoModel, itemsListModel, requestLpoBody } from 'src/app/core/models/scm/LPO.model';
import { userRoleModel } from 'src/app/core/models/scm/onboarding.model';
import { CustomersService } from 'src/app/core/services/scm/onboarding/customers/customers.service';
import { CrudService } from 'src/app/core/services/scm/crudServices/crud.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-create-oder',
  templateUrl: './create-oder.component.html',
  styleUrls: ['./create-oder.component.scss']
})
export class CreateOderComponent implements OnInit {

  tabNumber: Number = 0;
  public stepOneForm: FormGroup;
  public stepTwoForm: FormGroup;
  public stepThreeForm: FormGroup;
  suppliers: any = [];
  userLoad: userRoleModel;
  requestBody: requestLpoBody;
  SortColumn: string = "";
  PageNumber: number = 1;
  PageSize: number = 10;
  SearchQuery: string = "";
  taxSubTotal: any = 0;
  discountSubTotal: any = 0;
  subTotal: number = 0;
  miscSubTotal: number = 0;
  itemsList: any = [];
  tab1Payload: any = {};
  tab2Payload: any = [];
  tab3Payload: any = {};
  attachments: any = [];
  requestPaylaod: any = {};
  description: string = "Step 1: Add Purchase Order Details";
  isOnSubmit: boolean = false;
  hasError: boolean = true;
  buyers: any;
  preservedData: addLpoModel;

  // funvtion to calculate percentage of discount
  getDiscountPercentage() {
    let discount = this.stepTwoForm.get('discount').value;
    let total = this.stepTwoForm.get('total').value;
    let discountPercentage = ((discount / 100) * this.subTotal).toFixed(2);
    this.discountSubTotal = Number(this.taxSubTotal) - Number(discountPercentage);
    this.stepTwoForm.patchValue({
      discountPercentage: discountPercentage,
      total: Number(this.taxSubTotal) - Number(discountPercentage)
    })

  }

  // function to calculate percentage of tax
  getTaxPercentage() {
    let tax = this.stepTwoForm.get('tax').value;
    let total = this.stepTwoForm.get('total').value;
    // get accurate percentage of tax
    let taxPercentage = ((tax / 100) * this.subTotal).toFixed(2);
    this.stepTwoForm.patchValue({
      taxPercentage: taxPercentage,
      total: Number(taxPercentage) + Number(this.subTotal)
    })
    this.taxSubTotal = Number(this.subTotal) + Number(taxPercentage);
  }

  miscSumAll() {
    let misc = this.stepTwoForm.get('miscellaneousAmount').value;
    let total = this.stepTwoForm.get('total').value;
    let miscSum = parseInt(misc) + parseInt(total);
    this.miscSubTotal = Number(misc) + Number(this.subTotal)
    this.stepTwoForm.patchValue({
      total: this.miscSubTotal
    })

    console.log('total', this.stepTwoForm.get('total').value);
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private customersService: CustomersService,
    private gVars: GlobalsService,
    private crudService: CrudService,
    private location: Location
  ) {

    this.userLoad = this.gVars.checkRoute(this.gVars.router.url);
    this.requestBody = {
      "searchQuery": this.SearchQuery,
      "sortColumn": this.SortColumn,
      "pageNumber": this.PageNumber,
      "pageSize": this.PageSize,
      "session": this.userLoad?.session,
      "username": this.userLoad?.username,
      "subsidiaryId": this.userLoad?.subsidiaryId.toString(),
      "countryId": "01",
      "filter": ""
    }

    this.stepTwoForm = this.formBuilder.group({
      miscellaneous: ["", ],
      miscellaneousAmount: [0, ],
      tax: [0, ],
      // discount: [0, ],
      // taxPercentage: [0, ],
      discountPercentage: [0, ],
      total: [0, ],
      items: this.formBuilder.array([
        this.newItems()
      ])
    });


  }
  items(): FormArray {
    return this.stepTwoForm.get("items") as FormArray
  }

  newItems(): FormGroup {
    return this.formBuilder.group({
      item: ['', Validators.required],
      unitPrice: [0, Validators.required],
      quantity: [0, Validators.required],
      amount: [0,],
    })
  }

  addPriceXQuantity() {
    this.hasError = false;
    let items = this.stepTwoForm.get('items').value;
    let amount = 0;
    items.forEach((item) => {
      amount += item.quantity * item.unitPrice;
      // set each item amount to the amount calculated
      item.amount = item.quantity * item.unitPrice;
      // update the form control with the new value
      this.stepTwoForm.get('items').patchValue(items);
      // console.log(item.amount);
    })
    this.stepTwoForm.patchValue({
      total: Number(amount)
    })

    this.subTotal = Number(amount);
  }

  addItem() {
    if (this.stepTwoForm.valid) {
      this.items().push(this.newItems());
      this.hasError = false;
    } else {
      this.hasError = true;
      this.gVars.toastr.error("Please fill in all empty items fields");

    }

  }

  removeItem(i: number) {
    this.items().removeAt(i);
  }

  onTab1Submit() {
    let tab1Payload = this.stepOneForm.value;
    this.tab1Payload = tab1Payload;
    this.description = "Step 2: Add Items";

    console.log('tab1Payload', this.tab1Payload);
  }



  onTab2Submit() {
    // console.log("stepTwoForm:",this.stepTwoForm.value);
    this.description = "Step 3: Add Attachments Anf Payment Terms";
    // spread the items array into itemsList
    this.itemsList = [...this.stepTwoForm.get('items').value];
    let tab2Payload = {
      "miscellaneous": this.stepTwoForm.get('miscellaneous').value,
      "miscellaneousAmount": this.stepTwoForm.get('miscellaneousAmount').value,
      // "tax": this.stepTwoForm.get('taxPercentage').value,
      // "discount": this.stepTwoForm.get('discountPercentage').value,
      "total": this.stepTwoForm.get('total').value,
      "items": this.itemsList
    }

    // check if stepTwoForm is valid
    if (this.stepTwoForm.valid) {
      this.tab2Payload = tab2Payload;
      this.tabNumber = 3;

      // this.hasError = false;
    } else {
      // this.hasError = true;
      this.gVars.toastr.error("Please fill in all empty items fields");

    }

    // console.log("tab2Payload:",tab2Payload);
  }

  onTab3Submit() {
    let tab3Payload = {
      "attachments": this.attachments,
      "paymentTerms": this.stepThreeForm.get('paymentTerms').value,
    }
    this.tab3Payload = tab3Payload;
    console.log('tab3Payload', this.tab3Payload);

  }

  addAttachment(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      // convvert to base64 
      this.toBase64(file).then((base64: string) => {
        this.attachments.push({
          "fileName": file.name,
          "documentBase64": base64
        })
      });
    }
  }

  toBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  removeAttachment(index) {
    this.attachments.splice(index, 1);
  }





  toggleTab(val: Number) {
    this.tabNumber = val;
  }

  getSuppliers() {

    this.customersService.getSuppliers(this.requestBody).subscribe({
      next: (res) => {
        this.gVars.spinner.hide();
        this.suppliers = res.data;
        // console.log("Suppliers", this.suppliers);
      }, error: (err) => {
        this.gVars.spinner.hide();
        this.gVars.toastr.error("Error fetching data");
      }
    })

  }

  getBuyers() {
    this.customersService.getBuyers(this.requestBody).subscribe({
      next: (res) => {
        this.gVars.spinner.hide();
        this.buyers = res.data;
        // console.log("Buyers", this.buyers);
      }, error: (err) => {
        this.gVars.spinner.hide();
        this.gVars.toastr.error("Error fetching data");
      }
    })
  }

  

  goToPreview() {
    this.onTab3Submit();

    const requestPayload: addLpoModel = {
      "supplierId": this.tab1Payload.supplierId,
      session: this.userLoad?.session,
      username: this.userLoad?.username,
      subsidiaryId: this.userLoad?.subsidiaryId.toString(),
      "countryId": "01",
      "purchaseOrderDate": "",
      "purchaseOrderNo": this.tab1Payload.purchaseOrderNo,
      "subsidiaryCode": "",
      // "buyerId": this.tab1Payload.buyerId,
      "supplyDate": this.tab1Payload.supplyDate,
      "paymentDueDate": this.tab1Payload.paymentDueDate,
      "purchaseOrderSummary": this.tab1Payload.purchaseOrderSummary,
      "acceptedOffline": false,
      "paymentTerms": this.tab3Payload.paymentTerms,
      "additionalInformation": "",
      "hasAttachment": this.attachments.length > 0 ? true : false,
      "purchaseOrderStatus": "",
      // "tax": Number(this.tab2Payload.tax),
      // "discount": Number(this.tab2Payload.discount),
      "total": this.tab2Payload.total,
      "miscellaneous": this.tab2Payload.miscellaneousAmount,
      "currencyCode": "NGN",
      "dateCreated": this.tab1Payload.DateCreated,
      "items": this.tab2Payload.items,
      "attachments": this.attachments
    }

    this.crudService.updateLpoRequest(requestPayload);
    this.requestPaylaod = requestPayload;
    if (this.requestPaylaod) {
      this.router.navigate(['/scm/purchase-order/order-preview']);
    }
    console.log('requestPayload', requestPayload);

  }

  stepsUpdator() {
    this.isOnSubmit = true;
    if (this.tabNumber === 0) {
      // if step 1 form is valid
      if (this.stepOneForm.valid) {
        this.onTab1Submit();
        this.tabNumber = 2;
      } else {
        this.gVars.toastr.error("Please fill in all required fields");
      }
    } else if (this.tabNumber === 2) {
        this.onTab2Submit();


    } else if (this.tabNumber === 3) {
      this.goToPreview();
    }
  }

  getPreservedData() {
    this.crudService.getLpoRequest().subscribe({
      next: (data: any) => {
        this.requestPaylaod = data;
        console.log('requestPaylaod', this.requestPaylaod);
        this.tab1Payload = {
          "supplierId": this.requestPaylaod.supplierId,
          "purchaseOrderNo": this.requestPaylaod.purchaseOrderNo,
          "supplyDate": this.requestPaylaod.supplyDate,
          "paymentDueDate": this.requestPaylaod.paymentDueDate,
          "purchaseOrderSummary": this.requestPaylaod.purchaseOrderSummary,
          "DateCreated": this.requestPaylaod.dateCreated,
        }

        this.tab2Payload = {
          "items": this.requestPaylaod.items,
          "total": this.requestPaylaod.total,
          "miscellaneousAmount": this.requestPaylaod.miscellaneous,
          // "tax": this.requestPaylaod.tax,
          // "discount": this.requestPaylaod.discount,
        }

        this.tab3Payload = {
          "attachments": this.requestPaylaod.attachments,
          "paymentTerms": this.requestPaylaod.paymentTerms,
        }

        this.attachments = this.requestPaylaod.attachments;
        this.stepOneForm.patchValue({
          "supplierId": this.requestPaylaod.supplierId,
          "purchaseOrderNo": this.requestPaylaod.purchaseOrderNo,
          "supplyDate": this.requestPaylaod.supplyDate,
          "paymentDueDate": this.requestPaylaod.paymentDueDate,
          "purchaseOrderSummary": this.requestPaylaod.purchaseOrderSummary,
          "DateCreated": this.requestPaylaod.dateCreated,
        })

        this.stepTwoForm.patchValue({
          "items": this.requestPaylaod.items,
          "total": this.requestPaylaod.total,
          "miscellaneousAmount": this.requestPaylaod.miscellaneous,
          // "tax": this.requestPaylaod.tax,
          // "discount": this.requestPaylaod.discount,
        })

        this.stepThreeForm.patchValue({
          "paymentTerms": this.requestPaylaod.paymentTerms,
        })

        this.gVars.spinner.hide();
      }, error: (err) => {
        this.gVars.spinner.hide();
        this.gVars.toastr.error("Error fetching data");
      }
    })
  }

  goBack() {
    this.location.back();
    this.crudService.updateLpoRequest(null);
  }


  ngOnInit(): void {

    this.gVars.spinner.show();

    this.stepOneForm = this.formBuilder.group({
      purchaseOrderNo: ['', Validators.required],
      DateCreated: ['', Validators.required],
      supplierId: ['', Validators.required],
      // buyerId: ['', Validators.required],
      supplyDate: ['', Validators.required],
      paymentDueDate: ['', Validators.required],
      purchaseOrderSummary: ['', Validators.required]
    });

    this.stepThreeForm = this.formBuilder.group({
      paymentTerms: ['', Validators.required]
    });

    this.getSuppliers();
    this.getBuyers();
    this.getPreservedData();
  }




}

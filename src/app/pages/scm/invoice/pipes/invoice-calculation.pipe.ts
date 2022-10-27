import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { CreateAnInvoice } from '../../../../core/models/scm/invoices.model';

@Pipe({
  name: 'invoiceCalculation'
})
export class InvoiceCalculationPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe){}
  transform(invoice: CreateAnInvoice): string {
    const { discount, miscellaneous, invoiceValues, tax  } = invoice;
    let totalSum: number = invoiceValues.reduce((prev, elem) => elem.amount + prev, 0);
    if(discount > 0){
       totalSum = this.calculateDiscount(totalSum, discount)
    }
    if(tax > 0){
      totalSum = totalSum + this.calculateTax(totalSum, tax)
    }
    totalSum  = totalSum + miscellaneous;
    return this.currencyPipe.transform(totalSum, '₦');
  }


 private calculateDiscount(totalSum: number, discount: number) {
   return  totalSum - ((totalSum * discount) / 100);
  }

 private calculateTax(totalSum: number, tax: number) {
    return (totalSum * tax) / 100;
   }

}




